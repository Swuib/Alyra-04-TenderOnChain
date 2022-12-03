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


  uint8 maxLot ; //defini le nombre de lot max que peut contenir un lot
  uint priceAO ; //defini le montant à virer pour la creation de l'AO
  uint priceLot ; //defini le montant à virer pour la participation à un lot
  
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
    uint idAO;
    uint idLot;
    string description;
    uint TsCloture; //timeStampCloture
    address winner; //adress de l'attributaire du lot
    bool isNftAttributionEmit;
    bool isNftRealisationEmit;
    uint8 idEtapeLot;
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
  // nouvel Appel Offre
  event AoCreated(uint indexAO , address user);
  // nouveau lot cree
  event LotCreated(uint indexAO , uint indexLOT , address user);
  // argent recu
  event argentRecu(uint value , address user);

  //####################################
  // Modifier
  //####################################

  // verifie si l'utilisateur à bien creer son compte.
  modifier isRegistred() {
    require(mappingUsers[msg.sender].isRegistred, "You're not a user");
    _;
  }

  // verifie si l'utilisateur est un utilisateur verificateur.
  modifier isAuditor() {
    require(mappingUsers[msg.sender].isAuditor, "You're not a auditor");
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
    require(mappingUsers[msg.sender].isRegistred != true, "Already registered");
    require(keccak256(abi.encode(_name)) != keccak256(abi.encode("")), "You can't put nothing as a name");
    mappingUsers[msg.sender].isRegistred = true;
    mappingUsers[msg.sender].name = _name;
    emit userAdded(msg.sender,_name);
  }

  // modification du compte utilisateur.
  function editAccount(address _addr, string memory _name) external isRegistred {
    require(keccak256(abi.encode(_name)) != keccak256(abi.encode("")), "You can't put nothing as a name");
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
    require(mappingUsers[_addr].isRegistred = true, "user not registered");
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

  function createAO(address _addr, string memory _name) external isRegistred payable {
    require(msg.value >= priceAO , "Veuillez mettre le bon montant");
    //require le montant de la transaction est ok
    AO memory ao; 
    ao.aoName = _name;
    ao.adressDDO = _addr;
    ao.createdAt = block.timestamp;
    tableauAO.push(ao);
  }

  function editAO(uint _index, string memory _name) external isRegistred {
    require(tableauAO[_index].adressDDO == msg.sender,"vous etes pas le DDO de cet Appel d offre");
    tableauAO[_index].aoName = _name;
  }

  // ::::::::::::::::::::::::::::::::::::::::::::: LOT ::::::::::::::::::::::::::::::::::::::::::::: //

  // ajoute un lot
  function addLOT(string memory _name, uint _numeroAO) external isRegistred  {
    //le 0 étant l'index de depart on transmet un numeroAO = 1 pour index 0
    //controle des requires
    require(_numeroAO > 0 , "Veuillez indiquer un numero AO");
    //on verifie que le nombre de lot max est pas atteint
    // require(tableauAO[idAOmem].lotDeLAO.lengh < maxLot , "Vous avez atteint la limite du nombre de lots");
    uint  idAOmem = _numeroAO-1 ;
    //on cree un tableau en memory pour recuperer les infos transmise pour la creation du lot
    LOT memory lot;
    lot.description = _name;
    lot.idAO = idAOmem;
    //on l'ajout au tableau des lots
    tableauLots.push(lot);
    //on capte l'index de ce nouveau lot
    uint indexNouveauLot = tableauLots.length -1 ;
    //on le stocke également dans la definition des idex des lots de l'AO
    tableauAO[idAOmem].lotDeLAO.push(indexNouveauLot);
    //on emet l'event dédié
    //emit LOTcree(idAOmem, indexNouveauLot, emetteur) ;
  }

  
  function editLOT(uint _idx, string memory _name) external isRegistred {
    require( tableauAO[_idx].adressDDO == msg.sender,"vous etes pas le DDO de cet Appel d offre");
    tableauAO[_idx].aoName = _name ;
  }


  function getAO(uint _idx) public view returns (string memory _nom, address _addrDDO, bool _isPaid ) {
    return (tableauAO[_idx].aoName , tableauAO[_idx].adressDDO , tableauAO[_idx].isPaid ) ;
  }

  function transfertBalanceSecu (address _addr)external onlyOwner {
    //fonction de securite admin pour transférer tous les fonds vers une adresse de secours
  }
// ::::::::::::::::::::::::::::::::::::::::::::: PARTICIPATION ::::::::::::::::::::::::::::::::::::::::::::: //


  function createParticipation(uint _idlot) external {
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
