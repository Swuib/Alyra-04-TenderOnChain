const TenderOnChain = artifacts.require("./contracts/TenderOnChain.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const ether = require('@openzeppelin/test-helpers/src/ether');
const { expect } = require('chai');

  /**
  * ------------------------------------------
  * @title TenderOnChai
  * @author Swuib and Sebastien HOFF
  * @dev test in localy witch ganache accounts
  * @notice Les tests  ... (devant le manque de temps nous n'avons géré que quelques tests)
  * @command truffle test
  * ------------------------------------------
  */

contract("TenderOnChain", accounts => {

    const _owner = accounts[0];
    const montantAO = 1;
    const maxLotContrat = 30;

    const _DDO1 = accounts[1];
    const _DDO1Name = "DDO1";

    const _DDO2 = accounts[2];
    const _DDO2Name = "DDO2";

    const _SOUMI1 = accounts[3];
    const _SOUMI1Name = "SOUMI1";

    const _SOUMI2 = accounts[4];
    const _SOUMI2Name = "SOUMI2";

    const _SOUMI3 = accounts[5];
    const _SOUMI3Name = "SOUMI3";

    const _USER1 = accounts[6];
    const _USER1Name = "USER1";

    const _USER2 = accounts[7];
    const _USER2Name = "USER2";

    const _A01Name = "Appel offre 1";
    const _AO2Name = "Appel offre 2";

    const _AO1LOT1 = "AO1 LOT1";
    const _AO1LOT2 = "AO1 LOT2";
    const _AO1LOT3 = "AO1 LOT3";

    const _AO2LOT1 = "AO2 LOT1";
    const _AO2LOT2 = "AO2 LOT2";
    const _AO2LOT3 = "AO2 LOT3";

    let tenderInstance;

    describe("general", function () {

        beforeEach(async function () {
            tenderInstance = await TenderOnChain.new({ from: _owner });
        });

        describe("1 - USER TESTS", function () {

            it("test 1 : essaye d'ajouter un user depuis l'adresse owner", async () => {
                await expectRevert(tenderInstance.createAccount(_DDO1Name, { from: _owner }), "pas owner");
            });

            it("test 2 : essaye d'ajouter deux fois le meme utilisateur", async () => {
                await tenderInstance.createAccount(_DDO1Name, { from: _DDO1 });
                await expectRevert(tenderInstance.createAccount(_DDO1Name, { from: _DDO1 }), "Vous etes deja inscrit");
            });

            it("test 3 : emet l'event de utilistaeur ajouté", async () => {
                const storedData = await tenderInstance.createAccount(_DDO1Name, { from: _DDO1 });
                expectEvent(storedData, "userAdded", { user: _DDO1, name: _DDO1Name });
            });

            it("test 4 : Ajoute un utilisateur verifie isRegisterd doit etre true.", async () => {
                await tenderInstance.createAccount(_DDO1Name, { from: _DDO1 });
                const storedData = await tenderInstance.getAccount(_DDO1, { from: _DDO1 });
                expect(storedData.isRegistred).to.be.true;
            });

            it("test 5 : Ajoute un utilisateur verifie isAuditor doit etre false.", async () => {
                await tenderInstance.createAccount(_DDO1Name, { from: _DDO1 });
                const storedData = await tenderInstance.getAccount(_DDO1, { from: _DDO1 });
                expect(storedData.isAuditor).to.be.false;
            });

            it("test 6 : Ajoute un utilisateur verifie isApproval doit etre false.", async () => {
                await tenderInstance.createAccount(_DDO1Name, { from: _DDO1 });
                const storedData = await tenderInstance.getAccount(_DDO1, { from: _DDO1 });
                expect(storedData.isApproval).to.be.false;
            });

            it("test 7 : Ajoute un utilisateur verifie que date approval = 0.", async () => {
                await tenderInstance.createAccount(_DDO1Name, { from: _DDO1 });
                const storedData = await tenderInstance.getAccount(_DDO1, { from: _DDO1 });
                expect(storedData.dateApprouval) == 0;
            });

            it("test 8 : Ajoute un utilisateur edite et modifie son nom. controle event emis", async () => {
                await tenderInstance.createAccount(_DDO1Name, { from: _DDO1 });
                const newName = "nouveaunom";
                const storedData = await tenderInstance.editAccount(_DDO1, newName, { from: _DDO1 });
                expectEvent(storedData, "userUpdated", { user: _DDO1, name: newName });
            });

            it("test 9 : Ajoute un utilisateur edite et modifie son nom", async () => {
                await tenderInstance.createAccount(_DDO1Name, { from: _DDO1 });
                const newName = "nouveaunom";
                await tenderInstance.editAccount(_DDO1, newName, { from: _DDO1 });
                const storedData = await tenderInstance.getAccount(_DDO1, { from: _DDO1 });
                expect(storedData.name).to.equal(newName);
            });

            it("test 10 : essaye d'ajouter un utilisateur sans nom", async () => {
                const requireMessage = "Vous ne pouvez pas mettre rien comme nom";
                await expectRevert(tenderInstance.createAccount('', { from: _DDO1 }), requireMessage);
            });

            it("test 11 : Ajoute un utilisateur edite et modifie son nom par un nom vide", async () => {
                await tenderInstance.createAccount(_DDO1Name, { from: _DDO1 });
                const requireMessage = "Vous ne pouvez pas mettre rien comme nom";
                await expectRevert(tenderInstance.editAccount(_DDO1, '', { from: _DDO1 }), requireMessage);
            });
        }); //fin describe 1

        describe("2 - DEMANDE PASSAGE AUDITEUR", function () {
            beforeEach(async function () {
                await tenderInstance.createAccount(_USER1Name, { from: _USER1 });
                await tenderInstance.createAccount(_USER2Name, { from: _USER2 });
            });

            it("test 1 : essaye de requestNewAuditor . controle event emis", async () => {
                const storedData = await tenderInstance.requestNewAuditor({ from: _USER1 });
                expectEvent(storedData, "requestAuditor", { user: _USER1 });
            });

            it("test 2 : updateAcountToAuditor par non owner", async () => {
                const requireMessage = "Ownable: caller is not the owner";
                await expectRevert(tenderInstance.updateAcountToAuditor(_DDO1, { from: _DDO1 }), requireMessage);
            });

            it("test 3: updateAcountToAuditor par owner de un user enregsitre. check event", async () => {
                const storedData = await tenderInstance.updateAcountToAuditor(_USER1, { from: _owner });
                expectEvent(storedData, "userAuditor", { user: _USER1 });
            });
        }); // fin describe 2

        describe("3 - DEMANDE VALIDATION COMPTE", function () {
            beforeEach(async function () {
                await tenderInstance.createAccount(_USER1Name, { from: _USER1 });
                await tenderInstance.createAccount(_USER2Name, { from: _USER2 });
            });

            it("test 1 : essaye de requestAcountValidation . controle event emis", async () => {
                const storedData = await tenderInstance.requestAcountValidation({ from: _USER1 });
                expectEvent(storedData, "requestValide", { user: _USER1 });
            });
        });// fin describe 3

        describe("4 - CREATION AO", function () {
            beforeEach(async function () {
                await tenderInstance.createAccount(_DDO1Name, { from: _DDO1 });
                await tenderInstance.createAccount(_DDO2Name, { from: _DDO2 });
            });

            it("test 1 : cree AO sans argent", async () => {
                const requireMessage = "Veuillez mettre le bon montant";
                await expectRevert(tenderInstance.createAO(_A01Name, { from: _DDO1, value: new BN(0) }),requireMessage);
            });

            it("test 2 : cree AO sans nom", async () => {
                const requireMessage = "Vous ne pouvez pas mettre rien comme nom";
                await expectRevert(tenderInstance.createAO('', { from: _DDO1, value: '1000000000000000000' }), requireMessage);
            });

            it("test 3 : cree AO from user unregistred", async () => {
                const requireMessage = "Vous n'etes pas un utilisateur";
                await expectRevert(tenderInstance.createAO(_A01Name, { from: _SOUMI1, value: '1000000000000000000' }), requireMessage);
            });

            it("test 4 : edit AO controle event", async () => {
                await tenderInstance.createAO(_A01Name, { from: _DDO1, value: '1000000000000000000' });
                const indexAO = BN(0);
                const newName = "nouveauNomAO1";
                await tenderInstance.editAO(indexAO, newName, { from: _DDO1 });
                const storedData = await tenderInstance.editAO(indexAO, newName, { from: _DDO1 });
                expectEvent(storedData, "AoEddited", { indexAO: indexAO, name: newName, user: _DDO1 });
            });
        }); //fin describe 4

        describe("5 - LOTS TESTS", function () {
            beforeEach(async function () {
                await tenderInstance.createAccount(_DDO1Name, { from: _DDO1 });
                await tenderInstance.createAccount(_DDO2Name, { from: _DDO2 });
                await tenderInstance.createAO(_A01Name, { from: _DDO1, value: '1000000000000000000' });
                await tenderInstance.createAO(_AO2Name, { from: _DDO2, value: '1000000000000000000' });
            });

            it("test 1 : cree lot -  date cloture depasse inf date block", async () => {
                const requireMessage = "La date de cloture doit etre superieure a la date actuelle";
                const _index = 0;
                const _desc = "LOT1";
                const _ts = BN(100)
                const _cat = "CAT1";
                const _suscat = "SOUSCAT1";
                const _min = BN(10);
                const _max = BN(100);
                const _uriJson = "abc";
                const _uriLinkFile = "abc";

                await expectRevert(tenderInstance.createLot(
                    _index,
                    _desc,
                    _ts,
                    _cat,
                    _suscat,
                    _min,
                    _max,
                    _uriJson,
                    _uriLinkFile,
                    { from: _DDO1 }), requireMessage);
            });


            it("test 2 : cree lot -  min = 0", async () => {
                const requireMessage = "Le prix minimum doit etre superieur a 0";
                const _index = 0;
                const _desc = "LOT1";
                const _ts = BN(10000000000000);
                const _cat = "CAT1";
                const _suscat = "SOUSCAT1";
                const _min = 0;
                const _max = 100;
                const _uriJson = "  abc";
                const _uriLinkFile = "abc";
                await expectRevert(tenderInstance.createLot(
                    _index,
                    _desc,
                    _ts,
                    _cat,
                    _suscat,
                    _min,
                    _max,
                    _uriJson,
                    _uriLinkFile,
                    { from: _DDO1 }), requireMessage);
            });

            it("test 3 : cree lot -  max = 0", async () => {
                const requireMessage = "Le prix maximum doit etre superieur a 0";
                const _index = 0;
                const _desc = "LOT1";
                const _ts = BN(10000000000000);
                const _cat = "CAT1";
                const _suscat = "SOUSCAT1";
                const _min = BN(100);
                const _max = BN(0);
                const _uriJson = "  abc";
                const _uriLinkFile = "abc";
                await expectRevert(tenderInstance.createLot(
                    _index,
                    _desc,
                    _ts,
                    _cat,
                    _suscat,
                    _min,
                    _max,
                    _uriJson,
                    _uriLinkFile,
                    { from: _DDO1 }), requireMessage);
            });

            it("test 4 : cree lot -  min >max ", async () => {
                const requireMessage = "le prix minimum ne peut pas etre superieur au prix maximum";
                const _index = 0;
                const _desc = "LOT1";
                const _ts = BN(10000000000000);
                const _cat = "CAT1";
                const _suscat = "SOUSCAT1";
                const _min = BN(100);
                const _max = BN(90);
                const _uriJson = "  abc";
                const _uriLinkFile = "abc";
                await expectRevert(tenderInstance.createLot(
                    _index,
                    _desc,
                    _ts,
                    _cat,
                    _suscat,
                    _min,
                    _max,
                    _uriJson,
                    _uriLinkFile,
                    { from: _DDO1 }), requireMessage);
            });

            it("test 5 : cree lot - mauvais DDO", async () => {
                const requireMessage = "vous etes pas le DDO de cet Appel d offre";
                const _index = 0;
                const _desc = "LOT1";
                const _ts = BN(10000000000000);
                const _cat = "CAT1";
                const _suscat = "SOUSCAT1";
                const _min = BN(90);
                const _max = BN(100);
                const _uriJson = "  abc";
                const _uriLinkFile = "abc";
                await expectRevert(tenderInstance.createLot(
                    _index,
                    _desc,
                    _ts,
                    _cat,
                    _suscat,
                    _min,
                    _max,
                    _uriJson,
                    _uriLinkFile,
                    { from: _DDO2 }), requireMessage);
            });

            it("test 6 : cree lot - trop de lots", async () => {
                const requireMessage = "Vous avez atteint la limite du nombre de lots";
                const _index = 0;
                let _desc = "LOT";
                const _ts = BN(10000000000000);
                const _cat = "CAT1";
                const _suscat = "SOUSCAT1";
                const _min = BN(90);
                const _max = BN(100);
                const _uriJson = "  abc";
                const _uriLinkFile = "abc";

                for (let i = 1; i < maxLotContrat + 1; i++) {
                    _desc = "LOT" + i;
                    await tenderInstance.createLot(
                        _index,
                        _desc,
                        _ts,
                        _cat,
                        _suscat,
                        _min,
                        _max,
                        _uriJson,
                        _uriLinkFile,
                        { from: _DDO1 });
                }

                _desc = "LOT30";
                await expectRevert(tenderInstance.createLot(
                    _index,
                    _desc,
                    _ts,
                    _cat,
                    _suscat,
                    _min,
                    _max,
                    _uriJson,
                    _uriLinkFile,
                    { from: _DDO1 }), requireMessage);
            });
        }); //fin describe 5

        describe("6 - PARTICIPATIONS", function () {
            beforeEach(async function () {
                await tenderInstance.createAccount(_DDO1Name, { from: _DDO1 });
                await tenderInstance.createAccount(_DDO2Name, { from: _DDO2 });
                await tenderInstance.createAccount(_SOUMI1Name, { from: _SOUMI1 });
                await tenderInstance.createAccount(_SOUMI2Name, { from: _SOUMI2 });
                await tenderInstance.createAO(_A01Name, { from: _DDO1, value: '1000000000000000000' });
                await tenderInstance.createAO(_AO2Name, { from: _DDO2, value: '1000000000000000000' });
                let _index = 0;
                let _desc = "AO1-LOT1";
                let _ts = BN(1671145200);
                let _cat = "CAT";
                let _suscat = "SOUSCAT";
                const _min = BN(90);
                const _max = BN(100);
                const _uriJson = "URL JSON";
                const _uriLinkFile = "URL FICHIER PDF";

                await tenderInstance.createLot(
                    _index,
                    _desc,
                    _ts,
                    _cat,
                    _suscat,
                    _min,
                    _max,
                    _uriJson,
                    _uriLinkFile,
                    { from: _DDO1 }
                );// nft0

                _desc = "AO1-LOT2";

                await tenderInstance.createLot(
                    _index,
                    _desc,
                    _ts,
                    _cat,
                    _suscat,
                    _min,
                    _max,
                    _uriJson,
                    _uriLinkFile,
                    { from: _DDO1 }
                );// nft1

                //cree 2 lots pour AO2
                _index = 1; //index AO2
                _desc = "AO2-LOT1";

                await tenderInstance.createLot(
                    _index,
                    _desc,
                    _ts,
                    _cat,
                    _suscat,
                    _min,
                    _max,
                    _uriJson,
                    _uriLinkFile,
                    { from: _DDO2 });// nft2

                _desc = "AO2-LOT2";

                await tenderInstance.createLot(
                    _index,
                    _desc,
                    _ts,
                    _cat,
                    _suscat,
                    _min,
                    _max,
                    _uriJson,
                    _uriLinkFile,
                    { from: _DDO2 });// nft3

            }); //fin beforeach

            it("test 1 : cree participation sans argent", async () => {
                const requireMessage = "Veuillez mettre le bon montant";
                const _idlot = BN(0);
                const _price = BN(0); //prix du soumi
                const _uri = "urlIPFS";

                await expectRevert(tenderInstance.createParticipation(
                    _idlot,
                    _price,
                    _uri,
                    {
                        from: _SOUMI1,
                        value: new BN(0)
                    }),
                    requireMessage
                );
            });

            it("test 2 : cree participation. attend event", async () => {
                const _idlot = BN(0);
                const _price = BN(50);
                const _uri = "urlIPFS";
                const idNFT = BN(5);
                const storedData = await tenderInstance.createParticipation(
                    _idlot,
                    _price,
                    _uri,
                    {
                        from: _SOUMI1,
                        value: new BN(100)
                    });

                expectEvent(
                    storedData,
                    "participation",
                    {
                        indexLOT: _idlot,
                        user: _SOUMI1,
                        NftId: idNFT
                    });
            });
        });//fin describe 6

        describe("7 - ATRIBUTION DE MARCHE", function () {
            beforeEach(async function () {
                //cree user DDO1
                await tenderInstance.createAccount(_DDO1Name, { from: _DDO1 });
                // cree user DDO2
                await tenderInstance.createAccount(_DDO2Name, { from: _DDO2 });
                // cree user SOUMI1
                await tenderInstance.createAccount(_SOUMI1Name, { from: _SOUMI1 });
                // cree user SOUMI2
                await tenderInstance.createAccount(_SOUMI2Name, { from: _SOUMI2 });
                //cree AO index 0
                await tenderInstance.createAO(
                    _A01Name,
                    {
                        from: _DDO1,
                        value: '1000'
                    });

                //cree AO index 1
                await tenderInstance.createAO(
                    _AO2Name,
                    {
                        from: _DDO2,
                        value: '1000'
                    });
                //cree 2 lots pour AO1
                let _index = 0; //index AO1
                let _ts = BN(1671145200); //16122022 0h0
                let _cat = "CAT";
                let _suscat = "SOUSCAT";
                const _min = BN(90);
                const _max = BN(100);
                const _uriJson = "URL JSON";
                const _uriLinkFile = "URL FICHIER PDF";

                let _desc = "AO1-LOT1";
                await tenderInstance.createLot(
                    _index,
                    _desc,
                    _ts,
                    _cat,
                    _suscat,
                    _min,
                    _max,
                    _uriJson,
                    _uriLinkFile,
                    { from: _DDO1 }
                );// nft0

                _desc = "AO1-LOT2";

                await tenderInstance.createLot(
                    _index,
                    _desc,
                    _ts,
                    _cat,
                    _suscat,
                    _min,
                    _max,
                    _uriJson,
                    _uriLinkFile,
                    { from: _DDO1 }
                );// nft1



                //cree 2 lots pour AO2

                _index = 1; //index AO2
                _desc = "AO2-LOT1";


                await tenderInstance.createLot(
                    _index,
                    _desc,
                    _ts,
                    _cat,
                    _suscat,
                    _min,
                    _max,
                    _uriJson,
                    _uriLinkFile,
                    { from: _DDO2 });// nft2

                _desc = "AO2-LOT2";

                await tenderInstance.createLot(
                    _index,
                    _desc,
                    _ts,
                    _cat,
                    _suscat,
                    _min,
                    _max,
                    _uriJson,
                    _uriLinkFile,
                    { from: _DDO2 });// nft3
                const _price = BN(50); //prix du soumi
                const _uri = "urlIPFS";
                let _idlot = BN(0);
                //cree participation
                await tenderInstance.createParticipation(_idlot, _price,_uri,{from: _SOUMI1, value: new BN(55)});

                _idlot = BN(0);
                //cree participation
                await tenderInstance.createParticipation(_idlot,_price, _uri,{from: _SOUMI2, value: new BN(50)});
                _idlot = BN(1);
                //cree participation soumi 1 lot 2
                await tenderInstance.createParticipation( _idlot, _price, _uri,{ from: _SOUMI1, value: new BN(150) });
                _idlot = BN(0);
                //cree participation
                await tenderInstance.createParticipation(_idlot,_price, _uri,{from: _SOUMI2, value: new BN(130)});
            }); //fin beforeach

            it("test 1 : attribution LOT  PAS DDO de l'AO", async () => {
                const requireMessage = "vous etes pas le DDO de cet Appel d offre";
                const _niveau = BN(1);
                const _indexAo = BN(0);
                const _indexLot = BN(0);
                const _index = BN(0);
                const _addr = _SOUMI2;
                const _uriJson = "urlIPFS";

                await expectRevert(tenderInstance.attribution(
                    _niveau,
                    _indexAo,
                    _indexLot,
                    _index,
                    _addr,
                    _uriJson,
                    {
                        from: _DDO2
                    }),
                    requireMessage
                );
            });

            it("test 2 : attribution LOT  niveau trop bas", async () => {

                const requireMessage = "Le niveau doit etre superieur a zero";
                const _niveau = BN(0);
                const _indexAo = BN(0);
                const _indexLot = BN(0);
                const _index = BN(0);
                const _addr = _SOUMI2;
                const _uriJson = "urlIPFS";

                await expectRevert(tenderInstance.attribution(
                    _niveau,
                    _indexAo,
                    _indexLot,
                    _index,
                    _addr,
                    _uriJson,
                    {
                        from: _DDO1
                    }),
                    requireMessage
                );

            });

            it("test 3 : attribution LOT  niveau trop haut", async () => {

                const requireMessage = "Le niveau doit etre inferieur a 3";
                const _niveau = BN(3);
                const _indexAo = BN(0);
                const _indexLot = BN(0);
                const _index = BN(0);
                const _addr = _SOUMI2;
                const _uriJson = "urlIPFS";

                await expectRevert(tenderInstance.attribution(
                    _niveau,
                    _indexAo,
                    _indexLot,
                    _index,
                    _addr,
                    _uriJson,
                    {
                        from: _DDO1
                    }),
                    requireMessage
                );


            });

            it("test 4 : attribution LOT  non terminé", async () => {

                const requireMessage = "l'appel d'offre n'est pas termine";
                const _niveau = 1;
                const _indexAo = 0;
                const _indexLot = 0;
                const _index = 0;
                const _addr = _SOUMI2;
                const _uriJson = "urlIPFS";

                await expectRevert(tenderInstance.attribution(
                    _niveau,
                    _indexAo,
                    _indexLot,
                    _index,
                    _addr,
                    _uriJson,
                    {
                        from: _DDO1
                    }),
                    requireMessage
                );
            });
        });//fin describe 7
    }); //fin du describe general
}); //fin du contrat