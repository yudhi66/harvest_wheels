import './home.scss'
import Sidebar from '../../components/sidebar/sidebar'
import linkLine from '../../images/linkLine.png'
import bg from '../../images/Background.png'
import pointer from '../../images/pointer.png'
import line from '../../images/Line.png'
import { useCallback, useContext, useEffect, useState } from 'react'
import { collection, query, updateDoc, where ,or,and} from "firebase/firestore";
import { onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase_config'
import { getDocs, doc } from "firebase/firestore";
import { Authcontext } from '../../contextProvider'

function Home(){

    const obj =  [
        {
            userId:'b4oxnn4Gv7XTUuTB4s8i7ui7h3G2"',
            profileURL:'https://firebasestorage.googleapis.com/v0/b/harvest-wheels.appspot.com/o/1709743834705?alt=media&token=8c67be27-a5f4-41e0-b790-afe8984393bd',
            name:'Akshay',
            type:'request',
            start:'pune',
            destination:'thane',
            date:'16/08/2024',
            details:'I have 2m^2 of space left in my vehicle',
            spaceLeft:5,
            expiry:false,
            price:5,
            reply:{
                type:[
                    {
                        replyUserId:"b4oxnn4Gv7XTUuTB4s8i7ui7h3G2",
                        replyMessage:'Intrested',
                        space:6,
                        price:500
                    }
                ]
            }
        }
    ]

    const userRef = collection(db,"users");
    const loadLinksRef = collection(db,"loadLinks");
    const {currentUser} = useContext(Authcontext);
    const [userData,setUD] = useState({});
    const [userLinksData,setULD] = useState([]);
    const [str,setStr] = useState("");
    
    const [currentView,setCurrentView] = useState({});
    const [view,setView] = useState(false);



    useEffect(()=>{
            const FetchUserData = async()=>{
                const q=query(userRef,where("uid","==",`${currentUser.uid}`))
                const querySnapShot1 = await getDocs(q)
                const temp = []
                try{
                    querySnapShot1.forEach((doc)=>{
                        temp.push(doc.data())
                    })
                    console.log(temp)
                    setUD(temp[0])
                }catch(err){
                    console.log("error: ",err)
                }
            }
            FetchUserData();
    },[])

    useEffect(()=>{
        if(userData && userData.links){
            const FetchUserData = async()=>{
                let fullStr = "";
                for(let i=0;i<userData.links.length;i++){
                    fullStr = fullStr + userData.links[i];
                }
                console.log(fullStr)

                const q=query(loadLinksRef)
                const querySnapShot1 = await getDocs(q)
                const temp = [];
                try{
                    querySnapShot1.forEach((doc)=>{
                        temp.push(doc.data())
                    })
                }catch(err){
                    console.log("error: ",err)
                }

                let final = [];
                for(let i=0;i<temp.length;i++){
                    console.log(temp[i])
                    if(fullStr.includes(temp[i].userId)){
                        final = [...final,temp[i]];
                    }
                }

                setULD(final)
                console.log(final);
            }
            FetchUserData();
        }
    },[userData])


    const viewMore = (obj)=>{
        setCurrentView(obj);
        setView(true);
    }
    
    const bookSpace = ()=>{
        
    }
    return(
        <div className='Home' style={{backgroundImage:`url(${bg})`}}>
            <Sidebar/>
            <div className='Main'>

                {
                    view && 
                    <div className='currentView'>
                        <button onClick={()=>{setView(false)}}>X</button>
                        <div className='viewContent'>
                            <div className='map'>
                            </div>

                            <p className='desc'>
                                <p className='Title'>Description</p>
                                <p>{currentView.details}</p>
                            </p>
                            <div className='info'>
                                <img src={pointer}></img>
                                <p>Start: {currentView.start}</p>
                            </div>
                            <div className='info'>
                                <img src={pointer}></img>
                                <p>Destination: {currentView.destination}</p>
                            </div>

                            <input
                                type="range"
                                min={0}
                                max={100} // Replace 100 with your desired maximum value
                            />

                            <button onClick={()=>{bookSpace()}}>Book Now</button>
                        </div>
                    </div>
                } 
 
                <div className='loadLinks'>
                    {
                        userLinksData.map((loadLink)=>{
                            if(loadLink.type == 'posting'){
                                return(
                                    <div className='request'>
                                        <div className='userInfo'>
                                            <p className='name'>{loadLink.name}</p>
                                            <img src={loadLink.profileURL}></img>
                                        </div>
                                        <div className='travelInfo'>
                                            <img src={line} className='line'></img>
                                            <div className='info'>
                                                <img src={pointer}></img>
                                                <p>{loadLink.start}</p>
                                            </div>
                                            <div className='info'>
                                                <img src={pointer}></img>
                                                <p>{loadLink.destination}</p>
                                            </div>
                                        </div>
                                        <div className='map'>
                                            
                                        </div>
                                        <div className='Details'>
                                            <p className='d1'><b>Date:</b> {loadLink.date}</p>
                                            <p className='d1'><b>Space Left:</b> {loadLink.spaceLeft}m/s^2</p>
                                            <button className='bookBtn' onClick={()=>{viewMore(loadLink)}}>Book Now:  ₹{loadLink.price}</button>
                                        </div>
                                    </div>
                                )
                            }
                            else{
                                return(
                                    <div className='proposal'>
                                        <p>Start: {loadLink.start}</p>
                                        <p>destination: {loadLink.destination}</p>
                                        <p>date {loadLink.date}</p>
                                        <p>Details {loadLink.details}</p>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Home;
