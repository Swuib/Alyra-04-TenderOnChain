import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Header from '../../Layout/Header/Header';
import Loader from '../../Layout/Loader/Loader';
import toast from 'react-hot-toast';

const CreateAccount = () => {
    const { state: { contract, accounts } } = useEth();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    console.log(name);

    const handelCreate = async e => {
        setLoading(true);
        e.preventDefault();
        await contract.methods.createAccount(name).send({ from: accounts[0] }).then(res => {
            // const resProposalId = parseInt(res.events.Voted.returnValues.proposalId, 10);
            // const add = res.from;
            // console.log(res.events.userAdded.returnValues.name);
            // setRegisteredAdress(
            //     Object.values({
            //     ...RegisteredAdress, [UserIndexForRegisteredAdress]: 
            //     {...RegisteredAdress[UserIndexForRegisteredAdress],address:add.toLowerCase(), voteCount: resProposalId }}));
            // setProposalData(
            //     Object.values({
            //     ...ProposalData, [vote]: 
            //     {...ProposalData[vote], voteCount: voteCountProposal +1 }}));
            // setUserInfo({hasVoted:true, isRegistered:userInfo.isRegistered, votedProposalId:`${vote}`});
            toast(`Account ${res.events.userAdded.returnValues.name} recorded !`,
            {style: { height:'50px', background:'#1dc200',color:'white', fontSize:"15px", padding:'0px 15px'}});
            setLoading(false);
            navigate(`/Account/${name}`);
        }).catch(error => {
            if(error.code === 4001)
                toast(`${error.message}`,
                {style: { height:'50px', minWidth:'500px', background:'#ff2626',color:'white', fontSize:"15px", padding:'0px 15px'}});
            else {
                const errorObject = JSON.parse(error.message.replace("[ethjs-query] while formatting outputs from RPC '", "").slice(0, -1));
                console.log(errorObject);
                toast(errorObject.value.data.message.replace("VM Exception while processing transaction:",""),
                {style: { height:'50px', background:'#ff2626',color:'white', fontSize:"15px", padding:'0px 15px'}});
            }
            setLoading(false);
        });
    }
    
    return (
        <>
        {accounts !== null && (
            <>
                {accounts.length > 0 && (<Header/>)}
                <main>
                    <form onSubmit={handelCreate}>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Name of your company </label>
                            <input type="text" name="address" id="address" className="form-control" required onChange={e =>setName(e.target.value)}/>
                        </div>
                        <div className="btn-group">
                            {loading ? (
                                <Loader size={"small"}/>
                            ) : (
                                <button  className="myButton" type="submit">Create account</button>
                            )}
                        </div>
                    </form>
                </main>
            </>
        )}
        </>
    );
};

export default CreateAccount;