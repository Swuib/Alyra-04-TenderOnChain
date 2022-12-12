# Dapp 'TenderOnChain' (exercise n°4) (Final) [Alyra](https://alyra.fr/)

***

## Notes :
TenderOnChain is a marketplace based on blockchain technology that aims to improve the contractual relationship between the buyer and his co-contractor. The solution offers to comply with the all-digital logic imposed by the regulations in force since 2019 while guaranteeing transparency, proof of traceability and data security. 
It meets many challenges, including strengthening the bond of trust between economic actors, and thus reduce the risk of litigation, improve the competitive positioning and offer more visibility to contractors through a reputational scoring (NFT).

---
## Short video presentation of the Dapp :


[![Watch the video](https://img.youtube.com/vi/4IqwDoNhZRY/maxresdefault.jpg)](https://youtu.be/4IqwDoNhZRY)


---

## Website link :

This Dapp is accessible for testing purpose at this address : https://alyra-04-tender-on-chain.vercel.app

---

## Contract address on Göerli Test Network :

```
  0xC5eB091D163435510f06D146d4DA3218ed0F4A61
```    
 Link : [etherscan](https://goerli.etherscan.io/tx/0x2fa7d8842baa9652added86c73d48e1a1a37f20d95d3752f0c423d07badfa9a3)

---

## Göerli deployment :

```

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.


Migrations dry-run (simulation)
===============================
> Network name:    'goerli-fork'
> Network id:      5
> Block gas limit: 30000000 (0x1c9c380)


1_deploy_tender_on_chain.js
===========================

   Deploying 'TenderOnChain'
   -------------------------
   > block number:        8119347
   > block timestamp:     1670808619
   > account:             0x9B35Fa8639bB06712600840184c3707f0eBbF012
   > balance:             0.569429959536629936
   > gas used:            3957986 (0x3c64e2)
   > gas price:           2.500181436 gwei
   > value sent:          0 ETH
   > total cost:          0.009895683121147896 ETH

   -------------------------------------
   > Total cost:     0.009895683121147896 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.009895683121147896 ETH




Starting migrations...
======================
> Network name:    'goerli'
> Network id:      5
> Block gas limit: 30000000 (0x1c9c380)


1_deploy_tender_on_chain.js
===========================

   Deploying 'TenderOnChain'
   -------------------------
   > transaction hash:    0x2fa7d8842baa9652added86c73d48e1a1a37f20d95d3752f0c423d07badfa9a3
   > Blocks: 1            Seconds: 12
   > contract address:    0xC5eB091D163435510f06D146d4DA3218ed0F4A61
   > block number:        8119352
   > block timestamp:     1670808636
   > account:             0x9B35Fa8639bB06712600840184c3707f0eBbF012
   > balance:             0.569429869049154004
   > gas used:            3957986 (0x3c64e2)
   > gas price:           2.500204298 gwei
   > value sent:          0 ETH
   > total cost:          0.009895773608623828 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:     0.009895773608623828 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.009895773608623828 ETH


```

---

## Instructions for users who want to use the project locally :


  #### Please note that you need to have Ganache installed on your machine before continuing the instructions [Ganache](https://trufflesuite.com/ganache/)

* Start Ganache.
* Download the code then open in Visual Studio Code.
* Open a window in the VSC terminal and type the following command:

  ```
  $ cd client
  $ npm install
  ```
* Open a second window in the VSC terminal and type the following command:  

  ```
  $ cd truffle
  $ npm install
  $ truffle compile
  $ truffle migrate
  ```
* Now open a third terminal window and run the following command:  

  ```
  $ cd client
  $ npm start
  ```

* Note : 
    
    Compiler configuration "0.8.17"

    Using network 'development'.

    If you want to launch the contract on the fuji testnet, create a '.env' file in the truffle folder, with your MNEMONIC as variables.

    For the frontend side in loacl as well as in testnet, you must create a '.env' in the client folder, with your REACT_APP_PINATA_JWT as variables.



## Test result obtained :

* Then to run the test on the TenderOnChain contract, run the command : ``$ truffle test``

```
  Contract: TenderOnChain
    general
      1 - USER TESTS
        ✓ test 1 : essaye d'ajouter un user depuis l'adresse owner (352ms)
        ✓ test 2 : essaye d'ajouter deux fois le meme utilisateur (1218ms, 89809 gas)
        ✓ test 3 : emet l'event de utilistaeur ajouté (1226ms, 89809 gas)
        ✓ test 4 : Ajoute un utilisateur verifie isRegisterd doit etre true. (1216ms, 89809 gas)
        ✓ test 5 : Ajoute un utilisateur verifie isAuditor doit etre false. (1480ms, 89809 gas)
        ✓ test 6 : Ajoute un utilisateur verifie isApproval doit etre false. (1237ms, 89809 gas)
        ✓ test 7 : Ajoute un utilisateur verifie que date approval = 0. (1369ms, 89809 gas)
        ✓ test 8 : Ajoute un utilisateur edite et modifie son nom. controle event emis (2553ms, 122766 gas)
        ✓ test 9 : Ajoute un utilisateur edite et modifie son nom (2425ms, 122766 gas)
        ✓ test 10 : essaye d'ajouter un utilisateur sans nom (56ms)
        ✓ test 11 : Ajoute un utilisateur edite et modifie son nom par un nom vide (1219ms, 89809 gas)
      2 - DEMANDE PASSAGE AUDITEUR
        ✓ test 1 : essaye de requestNewAuditor . controle event emis (1193ms, 30014 gas)
        ✓ test 2 : updateAcountToAuditor par non owner (45ms)
        ✓ test 3: updateAcountToAuditor par owner de un user enregsitre. check event (1227ms, 37519 gas)
      3 - DEMANDE VALIDATION COMPTE
        ✓ test 1 : essaye de requestAcountValidation . controle event emis (1119ms, 29882 gas)
      4 - CREATION AO
        ✓ test 1 : cree AO sans argent (49ms)
        ✓ test 2 : cree AO sans nom (61ms)
        ✓ test 3 : cree AO from user unregistred (67ms)
        ✓ test 4 : edit AO controle event (3977ms, 212435 gas)
      5 - LOTS TESTS
        ✓ test 1 : cree lot -  date cloture depasse inf date block (51ms)
        ✓ test 2 : cree lot -  min = 0 (80ms)
        ✓ test 3 : cree lot -  max = 0 (47ms)
        ✓ test 4 : cree lot -  min >max  (52ms)
        ✓ test 5 : cree lot - mauvais DDO (47ms)
        ✓ test 6 : cree lot - trop de lots (49911ms, 9584412 gas)
      6 - PARTICIPATIONS
        ✓ test 1 : cree participation sans argent (40ms)
        ✓ test 2 : cree participation. attend event (1291ms, 206734 gas)
      7 - ATRIBUTION DE MARCHE
        ✓ test 1 : attribution LOT  PAS DDO de l'AO (119ms)
        ✓ test 2 : attribution LOT  niveau trop bas (74ms)
        ✓ test 3 : attribution LOT  niveau trop haut (45ms)
        ✓ test 4 : attribution LOT  non terminé (55ms)
```

---

```bash
·---------------------------------------------|---------------------------|-------------|----------------------------·
|    Solc version: 0.8.17+commit.8df45f5f     ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 6718946 gas  │
··············································|···························|·············|·····························
|  Methods                                                                                                           │
··················|···························|·············|·············|·············|··············|··············
|  Contract       ·  Method                   ·  Min        ·  Max        ·  Avg        ·  # calls     ·  eur (avg)  │
··················|···························|·············|·············|·············|··············|··············
|  TenderOnChain  ·  createAccount            ·      74809  ·      89821  ·      82100  ·          70  ·          -  │
··················|···························|·············|·············|·············|··············|··············
|  TenderOnChain  ·  createAO                 ·     115961  ·     145961  ·     129890  ·          28  ·          -  │
··················|···························|·············|·············|·············|··············|··············
|  TenderOnChain  ·  createLot                ·     317112  ·     388104  ·     333982  ·          54  ·          -  │
··················|···························|·············|·············|·············|··············|··············
|  TenderOnChain  ·  createParticipation      ·     161734  ·     206734  ·     190078  ·          17  ·          -  │
··················|···························|·············|·············|·············|··············|··············
|  TenderOnChain  ·  editAccount              ·          -  ·          -  ·      32957  ·           4  ·          -  │
··················|···························|·············|·············|·············|··············|··············
|  TenderOnChain  ·  editAO                   ·      31137  ·      35337  ·      32537  ·           3  ·          -  │
··················|···························|·············|·············|·············|··············|··············
|  TenderOnChain  ·  requestAcountValidation  ·          -  ·          -  ·      29882  ·           2  ·          -  │
··················|···························|·············|·············|·············|··············|··············
|  TenderOnChain  ·  requestNewAuditor        ·          -  ·          -  ·      30014  ·           2  ·          -  │
··················|···························|·············|·············|·············|··············|··············
|  TenderOnChain  ·  updateAcountToAuditor    ·          -  ·          -  ·      37519  ·           2  ·          -  │
··················|···························|·············|·············|·············|··············|··············
|  Deployments                                ·                                         ·  % of limit  ·             │
··············································|·············|·············|·············|··············|··············
|  TenderOnChain                              ·          -  ·          -  ·    3908433  ·      58.2 %  ·          -  │
·---------------------------------------------|-------------|-------------|-------------|--------------|-------------·

  31 passing (5m)
```

---

## License :

* [License](https://choosealicense.com/licenses/mit/)

---
