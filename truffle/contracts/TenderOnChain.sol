// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title TenderOnChain
/// @author Swuib and Sebastien HOFF
/// @notice This contract ...
contract TenderOnChain is ERC721URIStorage {

  constructor() ERC721("TENDERONCHAIN", "TOC") {}

  address public owner = msg.sender;                                                // adresse du proprietaire du contract
  address payable public dev = payable(0x1Adb4BbA0470F24B008863E5799daa7369F62C1b); // adrress du developpeur 1

  uint8 private maxLot = 30;                      // defini le nombre de lot max que peut contenir un lot
  uint private NftId;                             // defini l'id du nft
  uint public priceAO = 1 ether;                  // defini le montant à virer pour la creation de l'AO
  uint public priceLot = 100000000000000000 wei;  // defini le montant à virer pour la participation à un lot
  uint public aoLength;                           // defini le nombre total AO
  uint public lotLength;                          // defini le nombre total de lot
  uint public userLength;                         // defini le nombre total d'utilisateur

  
  /// @notice  structure des utilisateurs
  /// @dev  structure des utilisateurs
  struct Users {
    string name;                //raison sociale de la societé 
    bool isRegistred;           // vrai si l'utilisateur est enregistré
    bool isAuditor;             // vrai si l'utilisateur est un validateur d'autentification de societés
    bool isApproval;            // est vrai si l'auditeur a fait le contrôle de cette société
    address adresseValidateur;  // adresse du controleur qui a verifié la situation du DDO
    uint dateApprouval;         // timestamp de la validation ou devalidation du DDO
    uint countNFTWinner;        // count du nombre de lot gagné
    uint countNFTReal;          // count du nombre de lot réalisé
    uint countParticipation;    // count du nombre des participations
  }
  
  struct AO {
    address adressDDO;  // adresse du DDO qui va creer AO
    string aoName;      // nom de AO
    uint8 lastLotId;    // le dernier numero de lot creer
    uint[] lotDeLAO;    // contient les index des lots constituant l'ao
    uint createdAt;     // date de la creation de AO
    bool isOpen;        // permet de savoir l'état de l'AO
  }
  
  struct LOT {
    address adressDDO ;         // adresse du DDO qui va creer le lot
    uint idAO;                  // index de AO
    string description;         // description ou titre du lot 
    uint TsCloture;             // timeStamp Cloture du lot
    address winner;             // adress de l'attributaire du lot
    bool isNftAttributionEmit;  // si le nft d'attribution à été émit
    bool isNftRealisationEmit;  // si le nft de réalisation à été émit
    uint TsAtt;                 // timeStamp d'attribution du lot
    string categorie;           // categorie du lot
    string susCategorie;        // sous categorie du lot
    string URIPDF;              // URL du PDF du IPFS ou sur une SGBD dentralisée 
    uint minprice;              // prix min du lot 
    uint maxprice;              // prix max du lot 
    uint partLengt;             // longueur du tableau des participans 
    address[] part;             // tableau des participants
  }
  
  struct Participation {
    uint idLot;                 // index du lot
    uint Tsprice1;              // time stamp au moment ou le soumissionaire fait ça proposition
    uint price1;                // prix pour lequel le soumissionaire reéalisera le lot 
    bool isWinner;              // si il à ramporté le lot
    bool isRealisation;         // si il à réalisé le  lot
  }

  mapping(address => Users) mappingUsers;
  AO[] public arrayAO;
  LOT[] arrayLots; 
  mapping(address => Participation[]) mappingParticipation;

  //###########
  // The events
  //###########

  event userAdded(address user, string name);
  event userUpdated(address user, string name);
  event requestAuditor(address user);
  event requestValide(address user);
  event userAuditor(address user);
  event userDeleted(address user);
  event userAudited(address user, address auditor, uint time);
  event AoCreated(uint indexAO , string name , address user);
  event AoEddited(uint indexAO , string name , address user);
  event LotCreated(uint indexAO , uint indexLOT , address user, uint NftId,string name);
  event argentRecu(uint value , address user);
  event participation(uint indexLOT , address user, uint NftId);
  event winnerAttribution(uint indexAO ,uint indexLOT , address winner, uint  NftId);
  event RealisationAttribution(uint indexAO ,uint indexLOT , address winner, uint  NftId);

  //#########
  // Modifier
  //#########

  /**
  * @dev modifier qui verifie si l'utilisateur est bien le propriétaire du contrat
  */
  modifier onlyOwner() {
    require(msg.sender == owner, "Ownable: caller is not the owner");
    _;
  }

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

  //##############
  // The functions
  //##############
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

  /**
  * @dev Transfère le montant spécifié depuis le contrat vers l'adresse spécifiée.
  * @param _to L'adresse vers laquelle effectuer le transfert.
  * @param _amount Le montant à transférer.
  */
  function transfertBalanceSecuAmount(address _to, uint _amount) external onlyOwner {
    require(_amount > 0, "Le montant de transfert doit etre superieur a 0");
    require(address(this).balance >= _amount, "Le contrat n'a pas suffisamment de fonds pour effectuer le transfert");
    payable (_to).transfer(_amount);
  }

  // ::::::::::::::::::::::::::::::::::::::::::::: USER ::::::::::::::::::::::::::::::::::::::::::::: //
  // ----------------------------------------
  // User functions for manipulation account: 
  // ----------------------------------------

  /**
  * @dev Permet de creer un compte
  * @param _name Le nom de l'utilisateur
  */
  function createAccount(string memory _name) external {
    require(msg.sender != owner, "pas owner");
    require(mappingUsers[msg.sender].isRegistred != true, "Vous etes deja inscrit");
    require(keccak256(abi.encode(_name)) != keccak256(abi.encode("")), "Vous ne pouvez pas mettre rien comme nom");
    mappingUsers[msg.sender].isRegistred = true;
    mappingUsers[msg.sender].name = _name;
    userLength = userLength + 1;
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
  */
  function requestNewAuditor() external isRegistred {
    emit requestAuditor(msg.sender);
  }

  /**
  * @dev Cette fonction permet de demander la validation d'un compte
  */
  function requestAcountValidation() external isRegistred {
    emit requestValide(msg.sender);
  }

  /**
  * @dev Permet de récupérer les informations d'un utilisateur
  * @param _addr Adresse de l'utilisateur
  * @return Users memory
  */
  function getAccount(address _addr) external isRegistred view returns (Users memory) {
    return mappingUsers[_addr];
  }

  // ---------------------------------------
  // Owner fuctions for user manipulations :
  // ---------------------------------------

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

  /**
  * @dev Remplace l'adresse d'un utilisateur dans le mapping sans modifier la structure.
  * @param _oldAddress L'ancienne adresse de l'utilisateur.
  * @param _newAddress La nouvelle adresse de l'utilisateur.
  * @return bool True si l'adresse a été mise à jour avec succès, false sinon.
  */
  function updateAccount(address _oldAddress, address _newAddress) external onlyOwner returns(bool) {
    require(mappingUsers[_oldAddress].isRegistred, "L'utilisateur specifie n'existe pas dans le mapping");
    Users memory userData = mappingUsers[_oldAddress];
    delete mappingUsers[_oldAddress];
    mappingUsers[_newAddress] = userData;
    return true;
  }

  // -----------------------------------------
  // Auditor fuctions for user manipulations :
  // -----------------------------------------

  /**
  * @dev Met à jour le statut d'un utilisateur à approuvé
  * @param _addr Adresse de l'utilisateur à approuver
  */
  function updateAcountToApproval(address _addr, bool _result) external isAuditor {
    mappingUsers[_addr].isApproval = _result;
    mappingUsers[_addr].adresseValidateur = msg.sender;
    mappingUsers[_addr].dateApprouval = block.timestamp;
    emit userAudited(_addr, msg.sender, block.timestamp);
  }

  // ::::::::::::::::::::::::::::::::::::::::::::: AO ::::::::::::::::::::::::::::::::::::::::::::: //

  /**
  * @dev Permet de créer un AO
  * @param _name Nom de l'AO
  */
  function createAO(string memory _name) external isRegistred payable {
    require(msg.value >= priceAO , "Veuillez mettre le bon montant");
    require(keccak256(abi.encode(_name)) != keccak256(abi.encode("")), "Vous ne pouvez pas mettre rien comme nom");
    AO memory ao; 
    ao.aoName = _name;
    ao.adressDDO = msg.sender;
    ao.createdAt = block.timestamp;
    ao.isOpen = false;
    arrayAO.push(ao);
    dev.transfer(msg.value);
    emit AoCreated(aoLength,_name,msg.sender);
    aoLength = aoLength + 1;
  }

  /**
  * @dev permet de modifier le nom d'un appel d'offre
  * @param _index l'index de l'appel d'offre
  * @param _name le nouveau nom de l'appel d'offre
  */
  function editAO(uint _index, string memory _name) external isRegistred {
    require(arrayAO[_index].adressDDO == msg.sender,"vous etes pas le DDO de cet Appel d offre");
    arrayAO[_index].aoName = _name;
    emit AoEddited(_index,_name,msg.sender);
  }

  // ::::::::::::::::::::::::::::::::::::::::::::: LOT ::::::::::::::::::::::::::::::::::::::::::::: //

  /**
  * @dev Ajoute un lot à un appel d'offre
  * @param _index index de l'appel d'offre
  * @param _desc description du lot
  * @param _ts timestamp de cloture du lot
  * @param _cat categorie du lot
  * @param _suscat  sous categorie du lot
  * @param _min prix minimum du lot
  * @param _max prix maximum du lot
  * @param _uriJson uri du json du lot
  * @param _uriLinkFile uri du pdf du lot
  */
  function createLot(
    uint _index, 
    string memory _desc, 
    uint _ts,
    string memory _cat,
    string memory _suscat,
    uint _min,
    uint _max,
    string memory _uriJson,
    string memory _uriLinkFile
    ) external isRegistred  {
    require(_ts > block.timestamp, "La date de cloture doit etre superieure a la date actuelle");
    require(_min > 0, "Le prix minimum doit etre superieur a 0");
    require(_max > 0, "Le prix maximum doit etre superieur a 0");
    require(_min < _max , "le prix minimum ne peut pas etre superieur au prix maximum");
    require(arrayAO[_index].adressDDO == msg.sender,"vous etes pas le DDO de cet Appel d offre");
    require(arrayAO[_index].lotDeLAO.length < maxLot , "Vous avez atteint la limite du nombre de lots");
    LOT memory lot;
    lot.adressDDO = msg.sender;
    lot.idAO = _index;
    lot.description = _desc;
    lot.TsCloture = _ts;
    lot.categorie = _cat;
    lot.susCategorie = _suscat;
    lot.minprice = _min;
    lot.maxprice = _max;
    lot.URIPDF = _uriLinkFile;
    arrayLots.push(lot);
    arrayAO[_index].lastLotId = arrayAO[_index].lastLotId + 1;
    arrayAO[_index].lotDeLAO.push(lotLength);
    _mint(address(this), NftId);
    _setTokenURI(NftId, _uriJson);
    emit LotCreated(_index, lotLength, msg.sender, NftId,_desc);
    NftId = NftId + 1;
    lotLength = lotLength + 1;
  }

  function getArrayLots(uint _index) external isRegistred view returns (LOT memory) {
    if (arrayLots[_index].TsCloture > block.timestamp) {
        address[] memory part = new address[](0);
      return (LOT)(
        arrayLots[_index].adressDDO, 
        arrayLots[_index].idAO, 
        arrayLots[_index].description, 
        arrayLots[_index].TsCloture, 
        arrayLots[_index].winner, 
        arrayLots[_index].isNftAttributionEmit, 
        arrayLots[_index].isNftRealisationEmit, 
        arrayLots[_index].TsAtt,
        arrayLots[_index].categorie, 
        arrayLots[_index].susCategorie, 
        arrayLots[_index].URIPDF,
        arrayLots[_index].minprice, 
        arrayLots[_index].maxprice, 
        arrayLots[_index].partLengt,
        part
      );
    } else {
      return arrayLots[_index];
    }
  }

// ::::::::::::::::::::::::::::::::::::::::::::: PARTICIPATION ::::::::::::::::::::::::::::::::::::::::::::: //
  /**
  * @dev Cette fonction permet à un utilisateur enregistré de créer une participation 
  *      à un lot en fournissant l'ID du lot, le montant de l'offre et l'URI de 
  *      l'objet non-fongible (NFT) qui sera créé pour l'offre.
  * @param _idlot L'ID du lot dans lequel l'utilisateur souhaite participer.
  * @param _price Le montant de l'offre de l'utilisateur.
  * @param _uri L'URI de l'objet non-fongible (NFT) qui sera créé pour l'offre de l'utilisateur.
  */
  function createParticipation(uint256 _idlot, uint256 _price, string memory _uri) external isRegistred payable {
    require(msg.value >= priceLot , "Veuillez mettre le bon montant");
    require(arrayLots[_idlot].TsCloture > block.timestamp, "l'appel d'offre est termine");
    dev.transfer(msg.value);
    mappingParticipation[msg.sender].push(Participation(_idlot, block.timestamp, _price,false ,false));
    arrayLots[_idlot].part.push(msg.sender);
    arrayLots[_idlot].partLengt = arrayLots[_idlot].partLengt + 1;
    mappingUsers[msg.sender].countParticipation = mappingUsers[msg.sender].countParticipation + 1;
    _mint(address(this), NftId);
    _setTokenURI(NftId, _uri);
    NftId = NftId + 1;
    emit participation(_idlot , msg.sender, NftId);
  }
  
  /**
  * @dev Permet de récupérer une participation
  * @param _index l'index de la participation
  * @return la participation
  */
  function getMyParticipation(uint _index) external isRegistred view returns (Participation memory) {
    return mappingParticipation[msg.sender][_index];
  }

  /**
  * @dev Permet de récupérer une participation
  * @param _addr l'adresse de l'utilisateur
  * @param _index l'index de la participation
  * @return la participation
  */
  function getParticipationOwner(address _addr,uint _index) external onlyOwner view returns (Participation memory) {
    return mappingParticipation[_addr][_index];
  }

  /**
  * @dev Renvoie la longueur de la participation d'un utilisateur
  * @param _addr L'adresse de l'utilisateur
  * @return La longueur de la participation de l'utilisateur
  */
  function getParticipationLength(address _addr) external isRegistred view returns (uint) {
    return mappingParticipation[_addr].length;
  }

  /**
  * @dev Supprime une participation
  * @param _addr Adresse de l'utilisateur
  * @param _index Index de la participation
  */
  function removeParticipation(address _addr, uint _index) external onlyOwner {
    delete mappingParticipation[_addr][_index];
  }

  /**
  * @dev declare une participation winner ou bonne realisation
  * @param _niveau niveau de 1 à 2 (1= winner, 2 = bonne realisation)
  * @param _indexAo, index de l'AO sur lequel porte la participation
  * @param _indexLot, index du Lot sur lequel porte la participation
  * @param _index Index de la participation
  * @param _addr Adresse du gagant 
  * @param _uriJson Index de la participation
  */
  function attribution(uint8 _niveau, uint256 _indexAo, uint256 _indexLot, uint256 _index, address _addr, string memory _uriJson) external isRegistred {
    require(arrayLots[_indexAo].TsCloture < block.timestamp, "l'appel d'offre n'est pas termine");
    require(arrayAO[_indexAo].adressDDO == msg.sender,"vous etes pas le DDO de cet Appel d offre");
    require(_niveau > 0, "Le niveau doit etre superieur a zero");
    require(_niveau <= 3, "Le niveau doit etre inferieur a 3");
    if (_niveau == 1) {
      mappingParticipation[_addr][_index].isWinner = true;
      arrayLots[_indexLot].isNftAttributionEmit = true;
      arrayLots[_indexLot].TsAtt = block.timestamp;
      mappingUsers[_addr].countNFTWinner = mappingUsers[_addr].countNFTWinner +1;
      arrayLots[_indexLot].winner= _addr;
      _mint(address(this), NftId);
      _setTokenURI(NftId, _uriJson);
      emit winnerAttribution(_indexAo, _index, _addr, NftId);
        NftId = NftId + 1;
    } else if ((_niveau == 2) && (mappingParticipation[_addr][_index].isWinner = true)) {
      mappingParticipation[_addr][_index].isRealisation = true;
      arrayLots[_indexLot].isNftRealisationEmit = true;
      mappingUsers[_addr].countNFTReal = mappingUsers[_addr].countNFTReal + 1;
      _mint(address(this), NftId);
      _setTokenURI(NftId, _uriJson);
      emit RealisationAttribution(_indexAo, _index, _addr, NftId);
      NftId = NftId + 1;
    }
  }
}
