import { useEffect, useState,} from "react";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';          
import 'primeicons/primeicons.css';                         
import { useNavigate } from "react-router-dom"; 
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { format, parseISO } from 'date-fns';
import MyGoogleMap from '../components/MyGoogleMap';

function Index() {
    const [content, setContent] = useState([]); 
    const navigate = useNavigate(); 
    const [user, setUser] = useState(null); 
    const [show, setShow] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [review, setReview] = useState('');
    const [userReview, setuserReview] = useState([]);
    const [img, setImg] = useState(null);


    const handleClose = () => {
        setShow(false);
        setSelectedFiles([]); 
        setReview('');
    };
    const handleShow = () => {
        const token = localStorage.getItem("token"); 
        if (token) {
            setShow(true); 
        } else {
            Swal.fire({
                title: "จำเป็นต้องล็อกอิน",
                text: "กรุณาล็อกอินก่อนถึงจะสามารถรีวิวได้",
                icon: "warning",
                timer: 2000
            });
        }
    };
    const fetchData = async () => {
        try {
            const contentRes = await axios.get(`${config.apiPath}/content/getContent`); 
            if (contentRes.data.results && contentRes.data.results.length > 0) {
                setContent([contentRes.data.results[0]]); 
            } else {
                setContent([]); 
            }
        } catch (e) {
            Swal.fire({
                title: 'Error',
                text: e.message,
                icon: 'error',
            });
        }

        try {
            const res = await axios.get(config.apiPath + '/user/infoHomepage', config.headers());
            if (res.data.result) {
                setUser(res.data.result);
            }
        } catch (e) {
       
        }
        try {
            const reviewRes = await axios.get(`${config.apiPath}/content/getreview`);
            if (reviewRes.data && reviewRes.data.results) { 
                
                setuserReview(reviewRes.data.results);
            } else {
                setuserReview([]); 
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to fetch reviews.',
                icon: 'error',
            });
        }
    };
    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");  
                setUser(null);  
                Swal.fire('Logged Out!', 'You have been logged out successfully.', 'success');
                navigate('/');
            }
        });
    };

    useEffect(() => {
        fetchData(); 
    }, []);
    
    const handleFileUpload = (event) => {
        if (event.target.files.length > 0) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };
    const handleSave = async () => {
        const userId = user?.Id;
        const base64Images = selectedFiles.length > 0 ? await Promise.all(
            selectedFiles.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result.split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            })
        ) : []; 
    
        const image = base64Images.length > 0 ? base64Images[0] : null; 
    
        try {
            await axios.post(`${config.apiPath}/content/review`, {
                userId,
                comment: review, 
                image 
            });
    
            Swal.fire({
                title: 'Success',
                text: 'Your review has been saved!',
                icon: 'success'
            });fetchData(); 
    
            handleClose();  
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to submit your review.',
                icon: 'error'
            });
        }
    };

    const selectedFile = (inputFile) => {
        if (inputFile && inputFile.length > 0) {
            setImg(inputFile[0]);
        }
    }

    const handleUpload = async () => {
     
        if (!img) {
            Swal.fire({
                title: 'Error',
                text: 'Please select an image to upload.',
                icon: 'error'
            });
            return;
        }

        const confirmation = await Swal.fire({
            title: 'Confirm Upload',
            text: 'Are you sure you want to upload this image?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, upload it!',
            cancelButtonText: 'No, cancel!'
        });

        if (confirmation.isConfirmed) {
            const formData = new FormData();
            formData.append('myFile', img); 
            formData.append('userId', user.Id); 

            try {
                const res = await axios.post(config.apiPath + '/user/ProfileUpload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': localStorage.getItem('token')
                    }
                });

                Swal.fire({
                    title: 'Success',
                    text: res.data.message,
                    icon: 'success'
                });
                fetchData(); 
            } catch (e) {
                Swal.fire({
                    title: 'Error',
                    text: e.message,
                    icon: 'error'
                });
            }
        }
    };
    return (
        <>
<nav className="navbar navbar-expand-md bg-dark navbar-dark sticky-top">
    <a className="navbar-brand" style={{ margin: '0 20px',color: 'white', fontFamily: 'Kanit, sans-serif' }} href="/">น้ำตกผาน้ำหยด</a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navb" aria-expanded="true">
        <span className="navbar-toggler-icon"></span>
    </button>
    <div id="navb" className="collapse navbar-collapse">
    <ul className="navbar-nav ml-auto d-flex align-items-center justify-content-end w-100"> 
        <li className="nav-item">
            <a className="nav-link" href="#reviews" style={{ margin: '0 20px',color: 'white', fontFamily: 'Kanit, sans-serif' }}>
                <span className="fas fa-comments"></span> รีวิว
            </a>
        </li>
        <div className="image" style={{ margin: '0 15px' }}>
            <img
                src={user?.Profile_Image
                    ? user.Profile_Image.startsWith('http')
                        ? user.Profile_Image
                        : `data:image/jpeg;base64,${user.Profile_Image}`
                    : '/path/to/default-image.png'}
                className="img-circle elevation-2"
                alt="User Image"
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                }}
            />
        </div>
        <div style={{ margin: '0 15px',color: 'white' , fontFamily: 'Kanit, sans-serif'}}>
            {user?.First_Name} <span>{user?.Last_Name}</span>
        </div>
        {localStorage.getItem("token") && (
    <div className="upload-button d-flex align-items-center" >
        <label htmlFor="file-upload" className="btn btn-primary" style={{ margin: '15px' , fontFamily: 'Kanit, sans-serif'}}>
            Upload Image
        </label>
        <input 
            id="file-upload" 
            type="file" 
            style={{ display: 'none' }} 
            onChange={e => selectedFile(e.target.files)} 
        />
        <button 
        style={{fontFamily: 'Kanit, sans-serif'}}
            className="btn btn-success"
            onClick={handleUpload}
        >
            Submit
        </button>
    </div>
)}
        {user ? (
            <li className="nav-item">
                <a 
                    className="nav-link" 
                    onClick={handleLogout}
                    style={{ cursor: 'pointer', margin: '0 20px',fontFamily: 'Kanit, sans-serif' }} 
                >
                    <span className="fas fa-sign-out-alt"></span> Logout
                </a>
            </li>
        ) : (
            <>
                <li className="nav-item">
                    <a className="nav-link" href="/register" style={{ margin: '0 10px',color: 'white',fontFamily: 'Kanit, sans-serif' }}>
                        <span className="fas fa-user"></span> Sign Up
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/login" style={{ margin: '0 10px' ,color: 'white',fontFamily: 'Kanit, sans-serif'}}>
                        <span className="fas fa-sign-in-alt"></span> Login
                    </a>
                </li>
            </>
        )}
    </ul>
</div>

</nav>
            {content.length > 0 && (
                <div style={{ textAlign: 'center', width: '100%', maxWidth: '100%', padding: '10px',fontFamily: 'Kanit, sans-serif' }}>
                    <div 
                        style={{ maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }} 
                        dangerouslySetInnerHTML={{ 
                            __html: content[0].text.replace(/<img/g, '<img style="max-width: 100%; height: auto; max-height: 850px;"') 
                        }} 
                    />
                </div>
            )}
<div>
      <MyGoogleMap />
    </div>
        <div style={{
            display: "flex",
            justifyContent: "center", 
            alignItems: "center", 
        }}>
            <Button 
                id="reviews" 
                variant="primary"
                size="lg" 
                style={{ padding: "20px 20px", fontSize: "18px",fontFamily: 'Kanit, sans-serif' }} 
                onClick={handleShow} 
            >
                รีวิวสถานที่ท่องเที่ยว
            </Button>
        </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontFamily: 'Kanit, sans-serif' }} >Submit Your Review</Modal.Title> {/* Updated title */}
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="userName">
                            <Form.Label style={{ fontFamily: 'Kanit, sans-serif' }}>
                                {user?.First_Name} <span style={{ marginLeft: "10px",fontFamily: 'Kanit, sans-serif' }}>{user?.Last_Name}</span>
                            </Form.Label>
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="reviewText">
    <Form.Label style={{ fontFamily: 'Kanit, sans-serif' }}>รีวิว</Form.Label>
    <Form.Control 
        as="textarea" 
        rows={3} 
        onChange={(e) => setReview(e.target.value)} 
    />
</Form.Group>
                        <Form.Group className="mb-3" controlId="fileUpload">
                            <Form.Label style={{ fontFamily: 'Kanit, sans-serif' }}>อัปโหลดไฟล์</Form.Label>
                            <Form.Control type="file"style={{ fontFamily: 'Kanit, sans-serif' }} multiple onChange={handleFileUpload} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary"style={{ fontFamily: 'Kanit, sans-serif' }} onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary"style={{ fontFamily: 'Kanit, sans-serif' }} onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
    <div style={{ margin: '20px' }}>
    <h3 style={{ fontFamily: 'Kanit, sans-serif' }}>Review</h3>
    {userReview.length > 0 ? (
        userReview.map((review, index) => (
            <div key={index} className="review-card" style={{  marginBottom: '50px', 
                border: '1px solid #ccc', 
                padding: '50px',
                maxWidth: '1000px',
                margin: '0 auto',
                fontFamily: 'Kanit, sans-serif'  }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                        src={
                            review.user.Profile_Image 
                                ? review.user.Profile_Image.startsWith('http') 
                                    ? review.user.Profile_Image 
                                    : `data:image/jpeg;base64,${review.user.Profile_Image}`
                                : '/path/to/default-image.png'
                        } 
                        alt="User Profile" 
                        style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
                    />

                    <strong>{review.user.First_Name} {review.user.Last_Name}</strong>
                </div>
                <div
    style={{
        fontSize: '0.9em',
        color: 'gray',
        marginTop: '5px',
        fontFamily: 'Kanit, sans-serif'
    }}
>
    {format(parseISO(review.createdAt), 'dd-MM-yyyy HH:mm:ss')}
</div>

                
                <div style={{ fontSize: '20px'}}>{review.comment }</div>

                {review.image && (
                  <img 
                  src={`data:image/jpeg;base64,${review.image}`} 
                  alt="Review" 
                  style={{ 
                      maxWidth: '80%', 
                      height: 'auto', 
                      marginTop: '20px', 
                      display: 'block',  
                      marginLeft: 'auto', 
                      marginRight: 'auto', 
                      borderRadius:'10px'
                  }} 
              />
                )}
            </div>
        ))
    ) : (
        <p>ยังไม่มีรีวิว</p>
    )}
</div>

        </>
    );
}

export default Index;
