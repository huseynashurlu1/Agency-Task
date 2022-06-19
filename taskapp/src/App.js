import axios from 'axios';
import React, {useEffect, useState} from 'react'
import './App.css';
import { Spinner } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';

// api create
const api = axios.create({
  baseURL: 'http://localhost:3005/items/'
})
// api create

// tab-buttons
const buttons = ["To read", "In progress","Done"]
// tab-buttons


function App() {
  const notify = () => toast('Here is your toast.');
  const [items, setItems] = useState([])
  const [status, setStatus] = useState(0);
  const [tag, setTag] = useState('');
  const [loader, setLoader] = useState(false);
  const [active, setActive] = useState(0);


    const GetItems = () => {
      api.get('/').then(res => {
        setItems(res.data)
      })
    }

   useEffect(() => {
      GetItems()
   },[])


   const progressedItems = items.filter(item => item.status === status)
  const TagHandler = (e) => {
    setTag(e.target.innerHTML)
    console.log(tag);
  }

  const StartHandler = async (id,val) => {
    let data = await api.patch(`/${id}`,{
      status: val
    })
    GetItems()
    toast.success("Progress changed",{
      duration: 1500,
      style: {
          boxShadow: '0 0 0 #fff',
          border: '2px solid b0d4a1'
      }
     })
  }

  const DoneReadHandler = async (id,val) => {
    let data = await api.patch(`/${id}`,{
      status: val
    })
    GetItems()
    toast.success("Progress changed",{
      duration: 1500,
      style: {
          boxShadow: '0 0 0 #fff',
          border: '2px solid b0d4a1'
      }
     })
  }

  const ReturnInHandler = async (id,val) => {
    let data = await api.patch(`/${id}`,{
      status: val
    })
    setLoader(true)
    GetItems()
    setTimeout(() => {
      setLoader(false)
    }, 1500)
  }

  const ClickHandler = (index) => {
    setStatus(index)
    setActive(index)
  }


  return (
    <div className="App">
      <Toaster
            position="bottom-right"
            reverseOrder={false}
        />
       {loader ? <div className="d-flex justify-content-between align-items-center w-25 mx-auto">
       <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
        </Spinner>
        </div> :  <div className="container">
          <div className="tab-links">
            {
              buttons.map((btn,index) => {
                return(
                  <div className={active === index ? "active" : "deactive"} onClick={(e) => ClickHandler(index)}>{btn}</div>
                )
              })
            }
          </div>

         
            {
              progressedItems.length > 0 ? progressedItems.map(item => {
                return(
                  <div id={item.id} className='item-box'>
                    <p>{item.author}</p>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                      <div className='col-lg-8'>
                        <h6>{item.title}</h6>
                      </div>
                      <div className='col-lg-4 text-end'>
                          {
                            item.status === 0 ? <span onClick={(e) => StartHandler(item.id,1)} className='btn-start'>start reading →</span>
                            : item.status === 1 ? <span onClick={(e) => DoneReadHandler(item.id,2)} className='btn-start'>done reading →</span>
                            : <span className='btn-start' onClick={(e) => ReturnInHandler(item.id,0)}>return in reading →</span>
                          }
                      </div>
                      
                    </div>
                    <p>{item.description}</p>
                    <div className='tag-list'>
                      {
                        item.tags.map(tag => {
                          return(
                            <span onClick={TagHandler} className='tag'>#{tag}</span>
                          )
                        })
                      }
                    </div>
                  </div>
                )
              }) : <div className='item-box empty-box'>
                        <p>List is empty</p>
                   </div>
            }
        </div>
       
       }
        
    </div>
  );
}

export default App;
