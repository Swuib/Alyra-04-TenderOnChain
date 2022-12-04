// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

/// @title TenderOnChain
/// @author Swuib and Sebastien HOFF
/// @notice This contract ...
contract TenderOnChain is Ownable {

  constructor() {
    maxLot = 30;
    priceAO = 1 ether;
    priceLot = 100000000000000000 wei; 
    dev = payable(0x1Adb4BbA0470F24B008863E5799daa7369F62C1b);

  }

  address payable public dev;

  uint8 public maxLot;          // defini le nombre de lot max que peut contenir un lot
  uint public priceAO;          // defini le montant à virer pour la creation de l'AO
  uint public priceLot;         // defini le montant à virer pour la participation à un lot
  uint public AoLentght;
  uint public LotLentght;
  
  /// @notice  structure des utilisateurs
  /// @dev  structure des utilisateurs
  struct Users {
    string name;                //raison sociale de la societé 
    //(a voir si plus de data nécessaire que juste le name)
    bool isRegistred;           // vrai si l'utilisateur est enregistré
    bool isAuditor;             // vrai si l'utilisateur est un validateur d'autentification de societés
    bool isApproval;            // est vrai si l'auditeur a fait le contrôle de cette société
    address adresseValidateur;  // adresse du controleur qui a verifié la situation du DDO
    uint dateApprouval;         // timestamp de la validation ou devalidation du DDO
  }
  mapping(address => Users) mappingUsers;

  struct AO {
    address adressDDO;  // adresse du DDO qui va creer AO
    string aoName;      // nom de AO
    uint[] lotDeLAO;    //contient les index des lots constituant l'ao
    uint createdAt;     // date de la creation de AO
  }
  // creation du tableau des appels d'offre
  AO[] public tableauAO;

  // on ne peut pas faire de mapping AO/user ou AO /adress car on ne respecte plus le le critere d'unicité
  struct LOT {
    address adressDDO ;         // adresse du DDO qui va creer le lot
    uint idAO;                  // index de AO
    uint idLot; // ????????????????????????????????????????????????????????????
    string description;         // description ou titre du lot 
    uint TsCloture;             // timeStamp Cloture du lot
    address winner;             // adress de l'attributaire du lot
    bool isNftAttributionEmit;  // si le nft d'attribution à été émit 
    bool isNftRealisationEmit;  // si le nft de réalisation à été émit 
    uint8 idEtapeLot; // ????????????????????????????????????????????????????????????
    string categorie;           // categorie du lot
    uint minprice;              // prix min du lot 
    uint maxprice;              // prix max du lot 
    string URIPDF;              // URL du PDF du IPFS ou sur une SGBD dentralisée 
  }
  // creation du tableau des lots
  // il a été choisi de stocker les lots dans un tableau car nous devons parcourir le tableau pour recuperer avec le frontend la liste des lots
  LOT[] public tableauLots; 

  struct Participation {
    uint idLot;
    uint Tsprice1;
    uint price1;
    uint Tsprice2;
    uint price2;
  }
  mapping(address => Participation[]) mappingParticipation;

  // A TEST ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //option avec deux tours  :
  // struct Participation1 {
  //   uint idLot;
  //   uint Tsprice;
  //   uint price;
  // }
  // mapping(address => Participation1[]) mappingParticipation1;

  // struct Participation2 {
  //   uint idLot;
  //   uint Tsprice;
  //   uint price;
  // }
  // mapping(address => Participation2[]) mappingParticipation2;
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

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
  /**
  * @dev Event qui est déclenché lors de la création d'un lot
  * @param indexAO index de l'AO
  * @param indexLOT index du lot
  * @param user adresse de l'utilisateur qui a créé le lot
  */
  event LotCreated(uint indexAO , uint indexLOT , address user);
  /**
  * @dev Event qui se déclenche lorsque l'on reçoit de l'argent
  * @param value : montant reçu
  * @param user : adresse de l'utilisateur qui a envoyé l'argent
  */
  event argentRecu(uint value , address user);

  //####################################
  // Modifier
  //####################################

  /**
  * @dev modifier qui verifie si l'utilisateur à bien creer son compte
  */
  modifier isRegistred() {
    require(mappingUsers[msg.sender].isRegistred, "Vous n'etes pas un utilisateur");
    _;
  }

  /**
  * @dev modifier qui verifie si l'utilisateur est un auditeur
  */
  modifier isAuditor() {
    require(mappingUsers[msg.sender].isAuditor, "Vous n'etes pas un auditeur");
    _;
  }

  //####################################
  // The functions
  //####################################
  // :::::::::::::::::::::::::::::::::::::::::::: PRICE :::::::::::::::::::::::::::::::::::::::::::: //

  /**
  * @dev Retourne le solde du contrat
  * @return uint
  */
  function BalanceContrat() public view onlyOwner returns (uint){
    return address(this).balance;
  }

  /**
  * @dev Permet de modifier le prix pour creation l'AO
  * @param _nouveauPrix Le nouveau prix de l'AO
  * @return Le nouveau prix de l'AO
  */
  function setAOprice(uint _nouveauPrix) external onlyOwner returns(uint) {
    priceAO = _nouveauPrix; 
    return priceAO ; 
  }

  /**
  * @dev Permet de modifier le prix pour la creation d'un lot
  * @param _nouveauPrix le nouveau prix du lot
  * @return le nouveau prix du lot
  */
  function setLotprice(uint _nouveauPrix) external onlyOwner returns(uint) {
    priceLot = _nouveauPrix; 
    return priceLot ; 
  }

  /**
  * @dev Permet de détruire le contrat
  */
  function destroy() external onlyOwner {
    selfdestruct(dev);//a verif
  }

  /**
  * @dev Transfert tout le solde du contract vers l'adresse _to
  * @param _to Adresse de destination
  */
  function transfertBalanceSecu(address _to) external onlyOwner {
    payable (_to).transfer(address(this).balance);
  }

  // ::::::::::::::::::::::::::::::::::::::::::::: USER ::::::::::::::::::::::::::::::::::::::::::::: //
  // ------------------------------------------------------
  // User functions for manipulation account: 
  // ------------------------------------------------------

  /**
  * @dev Permet de creer un compte
  * @param _name Le nom de l'utilisateur
  */
  function createAccount(string memory _name) external {
    require(mappingUsers[msg.sender].isRegistred != true, "Vous etes deja inscrit");
    require(keccak256(abi.encode(_name)) != keccak256(abi.encode("")), "Vous ne pouvez pas mettre rien comme nom");
    mappingUsers[msg.sender].isRegistred = true;
    mappingUsers[msg.sender].name = _name;
    emit userAdded(msg.sender,_name);
  }

  /**
  * @dev Permet de modifier le nom d'un utilisateur
  * @param _addr L'adresse de l'utilisateur
  * @param _name Le nouveau nom de l'utilisateur
  */
  function editAccount(address _addr, string memory _name) external isRegistred {
    require(keccak256(abi.encode(_name)) != keccak256(abi.encode("")), "Vous ne pouvez pas mettre rien comme nom");
    mappingUsers[_addr].name = _name;
    emit userUpdated(_addr,_name);
  }

  /**
  * @dev Demande de passage au statut auditeur
  * @param _addr L'adresse de l'utilisateur
  */
  function requestNewAuditor(address _addr) external isRegistred {
    emit requestAuditor(_addr);
  }

  /**
  * @dev Cette fonction permet de demander la validation d'un compte
  * @param _addr L'adresse du compte à valider
  */
  function requestAcountValidation(address _addr) external isRegistred {
    emit requestValide(_addr);
  }

  /**
  * @dev Permet de récupérer les informations d'un utilisateur
  * @param _addr Adresse de l'utilisateur
  * @return Users memory
  */
  function getAccount(address _addr) external isRegistred view returns (Users memory) {
    return mappingUsers[_addr];
  }

  // ------------------------------------------------------
  // Owner fuctions for user manipulations :
  // ------------------------------------------------------

  /**
  * @dev Permet de récupérer les informations d'un utilisateur
  * @param _addr Adresse de l'utilisateur
  * @return Users memory
  */
  function getAccountForOwner(address _addr) external onlyOwner view returns (Users memory) {
    return mappingUsers[_addr];
  }

  /**
  * @dev Ajoute un utilisateur à la liste des auditeurs
  * @param _addr L'adresse de l'utilisateur à ajouter
  * @return L'utilisateur ajouté
  */
  function updateAcountToAuditor(address _addr) external onlyOwner returns (Users memory) {
    mappingUsers[_addr].isAuditor = true;
    emit userAuditor(_addr);
    return mappingUsers[_addr];
  }

  /**
  * @dev Supprime un utilisateur
  * @param _addr Adresse de l'utilisateur à supprimer
  */
  function deleteAccount(address _addr) external onlyOwner {
    require(mappingUsers[_addr].isRegistred = true, "utilisateur non enregistre");
    delete mappingUsers[_addr];
    emit userDeleted(_addr);
  }

  // fonction transfer addr en cas de perte 0x... d'un user 

  // ------------------------------------------------------
  // Auditor fuctions for user manipulations :
  // ------------------------------------------------------

  /**
  * @dev Met à jour le statut d'un utilisateur à approuvé
  * @param _addr Adresse de l'utilisateur à approuver
  */
  function updateAcountToApproval(address _addr) external isAuditor {
    mappingUsers[_addr].isApproval = true;
    mappingUsers[_addr].adresseValidateur = msg.sender;
    mappingUsers[_addr].dateApprouval = block.timestamp;
    emit userAudited(_addr, msg.sender, block.timestamp);
  }

  // ::::::::::::::::::::::::::::::::::::::::::::: AO ::::::::::::::::::::::::::::::::::::::::::::: //

  /**
  * @dev Permet de créer un AO
  * @param _name Nom de l'AO
  * @param _amount Montant à envoyer
  */
  function createAO(string memory _name, uint _amount) external isRegistred payable {
    require(_amount >= priceAO , "Veuillez mettre le bon montant");
    require(keccak256(abi.encode(_name)) != keccak256(abi.encode("")), "Vous ne pouvez pas mettre rien comme nom");
    AO memory ao; 
    ao.aoName = _name;
    ao.adressDDO = msg.sender;
    ao.createdAt = block.timestamp;
    tableauAO.push(ao);
    dev.transfer(_amount); 
    emit AoCreated(AoLentght,msg.sender);
    AoLentght = AoLentght + 1;
  }

  /**
  * @dev permet de modifier le nom d'un appel d'offre
  * @param _index l'index de l'appel d'offre
  * @param _name le nouveau nom de l'appel d'offre
  */
  function editAO(uint _index, string memory _name) external isRegistred {
    require(tableauAO[_index].adressDDO == msg.sender,"vous etes pas le DDO de cet Appel d offre");
    tableauAO[_index].aoName = _name;
    emit AoEddited(_index,msg.sender);
  }

  // ::::::::::::::::::::::::::::::::::::::::::::: LOT ::::::::::::::::::::::::::::::::::::::::::::: //

  /**
  * @dev Ajoute un lot à un appel d'offre
  * @param _index index de l'appel d'offre
  * @param _desc description du lot
  * @param _numeroAO numero de l'appel d'offre
  * @param _ts timestamp de cloture du lot
  * @param _cat categorie du lot
  * @param _min prix minimum du lot
  * @param _max prix maximum du lot
  * @param _uri uri du pdf du lot
  */
  function addLOT(
    uint _index, 
    string memory _desc, 
    uint _numeroAO, 
    uint _ts,
    string memory _cat,
    uint _min,
    uint _max,
    string memory _uri
    ) external isRegistred  {
    require(_numeroAO >= 0 , "Veuillez indiquer un numero AO convenable"); // pas sur que cela soit necessaire 
    require(_min < _max , "le prix minimum ne peut pas etre superieur au prix maximum");
    require(tableauAO[_index].adressDDO == msg.sender,"vous etes pas le DDO de cet Appel d offre");
    require(tableauAO[_index].lotDeLAO.length < maxLot , "Vous avez atteint la limite du nombre de lots");
    LOT memory lot;
    lot.adressDDO = msg.sender;
    lot.idAO = _numeroAO;
    lot.description = _desc;
    lot.TsCloture = _ts;
    lot.categorie = _cat;
    lot.minprice = _min;
    lot.maxprice = _max;
    lot.URIPDF = _uri;
    tableauLots.push(lot);
    // uint indexNouveauLot = tableauLots.length - 1;
    tableauAO[_index].lotDeLAO.push(LotLentght);
    emit LotCreated(_numeroAO, LotLentght, msg.sender);
    LotLentght = LotLentght + 1;
  }

  // à quoi cela sert ??? 
  // function getAO(uint _index) public view returns (string memory _nom, address _addrDDO, bool _isPaid ) {
  //   return (tableauAO[_index].aoName , tableauAO[_index].adressDDO , tableauAO[_index].isPaid);
  // }


// ::::::::::::::::::::::::::::::::::::::::::::: PARTICIPATION ::::::::::::::::::::::::::::::::::::::::::::: //

  // a revoir .... 
  function createParticipation(uint _idlot, uint _price) external {
    require(tableauLots[_idlot].TsCloture > block.timestamp ,"l'appel d'offre est termine");
    mappingParticipation[msg.sender].push(Participation(_idlot,block.timestamp,_price,block.timestamp + 10,10));
  }
  //-------------------------------------------
  //option avec deux tours  :   
  // /**
  // * @notice Cree une participation pour un lot
  // * @param _idlot l'id du lot
  // * @param _price le prix de la participation
  // */
  // function createParticipation1(uint _idlot, uint _price) external {
  //   require(tableauLots[_idlot].TsCloture > block.timestamp ,"l'appel d'offre est termine");
  //   mappingParticipation1[msg.sender].push(Participation1(_idlot,block.timestamp,_price));
  // }

  // /**
  // * @notice Cree une participation pour un lot
  // * @param _idlot l'id du lot
  // * @param _price le prix de la participation
  // */
  // function createParticipation2(uint _idlot, uint _price) external {
  //   require(tableauLots[_idlot].TsCloture > block.timestamp ,"l'appel d'offre est termine");
  //   mappingParticipation2[msg.sender].push(Participation2(_idlot,block.timestamp,_price));
  // }
  //-------------------------------------------

  /**
  * @dev Permet de récupérer une participation
  * @param _addr l'adresse de l'utilisateur
  * @param _index l'index de la participation
  * @return la participation
  */
  function getParticipation(address _addr,uint _index) external view returns (Participation memory) {
    return mappingParticipation[_addr][_index];
  }

  /**
  * @dev Renvoie la longueur de la participation d'un utilisateur
  * @param _addr L'adresse de l'utilisateur
  * @return La longueur de la participation de l'utilisateur
  */
  function getParticipationLength(address _addr) external view returns (uint) {
    return mappingParticipation[_addr].length;
  }

  /**
  * @dev Supprime une participation
  * @param _addr Adresse de l'utilisateur
  * @param _index Index de la participation
  */
  function removeParticipation(address _addr, uint _index) external {
    delete mappingParticipation[_addr][_index];
  }


// :::::::::::::::::::::::::::::::::::::::::::::::::: NFT :::::::::::::::::::::::::::::::::::::::::::::::::: //

// require pour que le createur de AO ne puisse pas participer a son AO
// le soum a bien payer
  // function createNftForLot() {
    
  // }

  // function createNftForParticipation(address _participant) external isRegistred {

  // }

  // function createNftForWinner(address _participant) external isRegistred {

  // }

  // function createNftForWinnerAndAchivment(address _participant) external isRegistred {

  // }

}
