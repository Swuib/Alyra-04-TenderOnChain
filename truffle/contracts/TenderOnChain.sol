// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @title TenderOnChain
/// @author Swuib and Sebastien HOFF
/// @notice This contract ...
contract TenderOnChain is Ownable {

  constructor() {
    maxLot = 30;
    priceAO = 1 ether;
    priceLot = 100000000000000000 wei; 
  }


  uint8 public maxLot; //defini le nombre de lot max que peut contenir un lot
  uint public priceAO; //defini le montant à virer pour la creation de l'AO
  uint public priceLot; //defini le montant à virer pour la participation à un lot
  uint public AoLentght;
  uint public LotLentght;
  
  /// @notice  structure des utilisateurs
  /// @dev  structure des utilisateurs
  struct Users {
    string name; //raison sociale de la societé 
    //(a voir si plus de data nécessaire que juste le name)
    bool isRegistred;// vrai si l'utilisateur est enregistré
    bool isAuditor; // vrai si l'utilisateur est un validateur d'autentification de societés
    //controle du profil financier par un tiers
    bool isApproval; //est vrai si l'auditeur a fait le contrôle de cette société
    address adresseValidateur; //adresse du controleur qui a verifié la situation du DDO
    uint dateApprouval; // timestamp de la validation ou devalidation du DDO
  }
  //on cree un mapping adresse/user
  mapping(address => Users) mappingUsers;

  struct AO {
    address adressDDO ; //adresse du DDO qui va creer AO
    string  aoName;  // nom de AO
    bool    isPaid; // c'est le booleen qui dit qui à bien payer pour AO (a voir ..)
    uint[]  lotDeLAO; //contient les index des lots constituant l'ao
    uint createdAt; // date de la creation de AO
  }
  //creation du tableau des appels d'offre
  AO[] public tableauAO;

  //on ne peut pas faire de mapping AO/user ou AO /adress car on ne respecte plus le le critere d'unicité
  struct LOT {
    address adressDDO ; //adresse du DDO qui va creer le lot
    uint idAO;  // index de AO
    uint idLot; // ????????????????????????????????????????????????????????????
    string description; // description ou titre du lot 
    uint TsCloture; // timeStamp Cloture du lot
    address winner; // adress de l'attributaire du lot
    bool isNftAttributionEmit;  // si le nft d'attribution à été émit 
    bool isNftRealisationEmit;  // si le nft de réalisation à été émit 
    uint8 idEtapeLot; // ????????????????????????????????????????????????????????????
    string categorie; // categorie du lot
    string susCategorie; // sous categorie du lot
    uint minprice; // prix min du lot 
    uint maxprice; // prix max du lot 
    string URIPDF; //URL du PDF du IPFS ou sur une SGBD dentralisée 
  }
  //creation du tableau des lots
  //il a été choisi de stocker les lots dans un tableau car nous devons parcourir le tableau pour recuperer avec le frontend la liste des lots
  LOT[] public tableauLots; 

  struct Participation {
    uint idLot;
    uint Tsprice1; //timestamp
    uint price1;
    uint Tsprice2; //timestamp
    uint price2;
  }
  // a soluce .... 
  // Soumissions[] public tableauSoum;
  mapping(address => Participation[]) mappingParticipation; // soumi / adress
  // A TEST ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  // enum etapeAO {
  //   definitionAO,
  //   definitionLOT,
  //   reponseAO,
  //   depouillementAO,
  //   aoClos
  // }


  //####################################
  // The events
  //####################################
  event transferSecu(uint codeAction, address user); // ???? je sais pas ce que tu à voulu faire !
  //un utilisateur a été ajouté au tableau des utilisateurs
  event userAdded(address user, string name);
  event userUpdated(address user, string name);
  event requestAuditor(address user);
  event requestValide(address user);
  event userAuditor(address user);
  event userDeleted(address user);
  event userAudited(address user, address auditor, uint time);
  // Appel Offre
  event AoCreated(uint indexAO , address user);
  event AoEddited(uint indexAO , address user);
  // nouveau lot cree
  event LotCreated(uint indexAO , uint indexLOT , address user);
  event LotEddited(uint indexLOT , address user);
  // argent recu
  event argentRecu(uint value , address user);

  //####################################
  // Modifier
  //####################################

  // verifie si l'utilisateur à bien creer son compte.
  modifier isRegistred() {
    require(mappingUsers[msg.sender].isRegistred, "Vous n'etes pas un utilisateur");
    _;
  }

  // verifie si l'utilisateur est un utilisateur verificateur.
  modifier isAuditor() {
    require(mappingUsers[msg.sender].isAuditor, "Vous n'etes pas un auditeur");
    _;
  }

  //####################################
  // The functions
  //####################################
  // :::::::::::::::::::::::::::::::::::::::::::: PRICE :::::::::::::::::::::::::::::::::::::::::::: //

  /// @dev afficher la balance du contrat
  function BalanceContrat() public view onlyOwner returns (uint){
    return address(this).balance;
  }

  /// @dev change le prix pour la creation d'un Appel d'offre
  function setAOprice(uint _nouveauPrix) external onlyOwner returns(uint) {
    priceAO = _nouveauPrix; 
    return priceAO ; 
  }

  /// @dev change le prix pour la creation d'un lot
  function setLotprice(uint _nouveauPrix) external onlyOwner returns(uint) {
    priceLot = _nouveauPrix; 
    return priceLot ; 
  }

  // ::::::::::::::::::::::::::::::::::::::::::::: USER ::::::::::::::::::::::::::::::::::::::::::::: //

  // ------------------------------------------------------
  // User functions for manipulation account: 
  // ------------------------------------------------------

  // creation de compte utilisateur.
  function createAccount(string memory _name) external {
    require(mappingUsers[msg.sender].isRegistred != true, "Vous etes deja inscrit");
    require(keccak256(abi.encode(_name)) != keccak256(abi.encode("")), "Vous ne pouvez pas mettre rien comme nom");
    mappingUsers[msg.sender].isRegistred = true;
    mappingUsers[msg.sender].name = _name;
    emit userAdded(msg.sender,_name);
  }

  // modification du compte utilisateur.
  function editAccount(address _addr, string memory _name) external isRegistred {
    require(keccak256(abi.encode(_name)) != keccak256(abi.encode("")), "Vous ne pouvez pas mettre rien comme nom");
    mappingUsers[_addr].name = _name;
    emit userUpdated(_addr,_name);
  }

  // A VERIF
  // demande de passage au statut auditeur. (a voir pour plus d'info pour contacter l'utilisateur)
  function requestNewAuditor(address _addr) external isRegistred {
    emit requestAuditor(_addr);
  }

  // A VERIF
  // demande de validation des donées du compte par un auditeur. (a voir pour plus d'info pour contacter l'utilisateur)
  function requestAcountValidation(address _addr) external isRegistred {
    emit requestValide(_addr);
  }

  // recuperation des information d'un utilisateur.
  function getAccount(address _addr) external isRegistred view returns (Users memory) {
    return mappingUsers[_addr];
  }

  // ------------------------------------------------------
  // Owner fuctions for user manipulations :
  // ------------------------------------------------------

  // recuperation des information d'un utilisateur.
  function getAccountForOwner(address _addr) external onlyOwner view returns (Users memory) {
    return mappingUsers[_addr];
  }

  // passage d'un utilisateur => verificateur.
  function updateAcountToAuditor(address _addr) external onlyOwner returns (Users memory) {
    mappingUsers[_addr].isAuditor = true;
    emit userAuditor(_addr);
    return mappingUsers[_addr];
  }

  // supprimer un compte au cas ou !
  function deleteAccount(address _addr) external onlyOwner {
    require(mappingUsers[_addr].isRegistred = true, "utilisateur non enregistre");
    delete mappingUsers[_addr];
    emit userDeleted(_addr);
  }

  // fonction transfer addr en cas de perte 0x... d'un user 

  // ------------------------------------------------------
  // Auditor fuctions for user manipulations :
  // ------------------------------------------------------

  // mise a jour des donnés de l'utilisateur (vérification utilisateur)
  function updateAcountToApproval(address _addr) external isAuditor {
    mappingUsers[_addr].isApproval = true;
    mappingUsers[_addr].adresseValidateur = msg.sender;
    mappingUsers[_addr].dateApprouval = block.timestamp;
    emit userAudited(_addr, msg.sender, block.timestamp);
  }

  // ::::::::::::::::::::::::::::::::::::::::::::: AO ::::::::::::::::::::::::::::::::::::::::::::: //

  function createAO(string memory _name) external isRegistred payable {
    require(msg.value >= priceAO , "Veuillez mettre le bon montant");
    require(keccak256(abi.encode(_name)) != keccak256(abi.encode("")), "Vous ne pouvez pas mettre rien comme nom");
    AO memory ao; 
    ao.aoName = _name;
    ao.adressDDO = msg.sender;
    ao.createdAt = block.timestamp;
    tableauAO.push(ao);
    emit AoCreated(AoLentght,msg.sender);
    AoLentght = AoLentght + 1;
  }

  function editAO(uint _index, string memory _name) external isRegistred {
    require(tableauAO[_index].adressDDO == msg.sender,"vous etes pas le DDO de cet Appel d offre");
    tableauAO[_index].aoName = _name;
    emit AoEddited(_index,msg.sender);
  }

  // ::::::::::::::::::::::::::::::::::::::::::::: LOT ::::::::::::::::::::::::::::::::::::::::::::: //

  ///  @dev fonction d'ajout de lot
  ///  @param _index index du tableauAO, _desc
  ///  @param _desc description du lot 
  ///  @param _numeroAO ????????????????????????????????
  ///  @param _ts timestamp de la fin du lot
  ///  @param _cat categorie du lot
  ///  @param _susCat sous categorie du lot 
  ///  @param _min prix minimum
  ///  @param _max prix maximum
  ///  @param _uri uri du pdf nft du lot
  function addLOT(
    uint _index, 
    string memory _desc, 
    uint _numeroAO, 
    uint _ts,
    string memory _cat,
    string memory _susCat,
    uint _min,
    uint _max,
    string memory _uri
    ) external isRegistred  {
    require(_numeroAO >= 0 , "Veuillez indiquer un numero AO convenable"); // pas sur que cela soit necessaire 
    require(_min < _max , "le prix minimum ne peut pas etre superieur au prix maximum");
    require(tableauAO[_index].adressDDO == msg.sender,"vous etes pas le DDO de cet Appel d offre");

    //on verifie que le nombre de lot max est pas atteint
    // require(tableauAO[idAOmem].lotDeLAO.lengh < maxLot , "Vous avez atteint la limite du nombre de lots");
    //on cree un tableau en memory pour recuperer les infos transmise pour la creation du lot
    LOT memory lot;
    lot.adressDDO = msg.sender;
    lot.idAO = _numeroAO;
    lot.description = _desc;
    lot.TsCloture = _ts;
    lot.categorie = _cat;
    lot.susCategorie = _susCat;
    lot.minprice = _min;
    lot.maxprice = _max;
    lot.URIPDF = _uri;
    tableauLots.push(lot);
    // uint indexNouveauLot = tableauLots.length - 1;
    tableauAO[_index].lotDeLAO.push(LotLentght);
    //on emet l'event dédié
    emit LotCreated(_numeroAO, LotLentght, msg.sender);
    LotLentght = LotLentght + 1;
  }


  // function editLOT(uint _index, string memory _desc) external isRegistred {
  //   require(tableauLots[_index].adressDDO == msg.sender,"vous etes pas le DDO de cet Appel d offre");
  //   tableauLots[_index].description = _desc;
  //   emit LotEddited(_index,msg.sender);
  // }


  // à quoi cela sert ??? 
  function getAO(uint _index) public view returns (string memory _nom, address _addrDDO, bool _isPaid ) {
    return (tableauAO[_index].aoName , tableauAO[_index].adressDDO , tableauAO[_index].isPaid);
  }

  function transfertBalanceSecu (address _addr)external onlyOwner {
    //fonction de securite admin pour transférer tous les fonds vers une adresse de secours
  }
// ::::::::::::::::::::::::::::::::::::::::::::: PARTICIPATION ::::::::::::::::::::::::::::::::::::::::::::: //


  function createParticipation(uint _idlot) external {
    require(tableauLots[_idlot].TsCloture > block.timestamp ,"l'appel d'offre est termine");
    mappingParticipation[msg.sender].push(Participation(_idlot,block.timestamp,5,block.timestamp + 10,10));
  }

  function getParticipation(address _addr,uint _index) external view returns (Participation memory) {
    return mappingParticipation[_addr][_index];
  }

  function getParticipationLength(address _addr) external view returns (uint) {
    return mappingParticipation[_addr].length;
  }

  function removeParticipation(address _addr, uint _index) external{
    delete mappingParticipation[_addr][_index];
  }


// :::::::::::::::::::::::::::::::::::::::::::::::::: NFT :::::::::::::::::::::::::::::::::::::::::::::::::: //

// require pour que le createur de AO ne puisse pas participer a son AO
// le soum a bien payer
  // function createNftForLot() {
    
  // }

  // function createNftForParticipation() {

  // }

  // function createNftForWinner() {

  // }

  // function createNftForWinnerAndAchivment() {

  // }

}
