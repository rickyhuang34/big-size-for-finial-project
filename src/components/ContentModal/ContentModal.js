import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import axios from 'axios';
import { img_500, unavailable, unavailableLandscape } from '../../Config/Config';
import { Button } from '@material-ui/core';
import { YouTube } from '@material-ui/icons';
import "./ContentModal.css"
import Gallery from './Carousel/Carousel';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width:"90%",
    height:"80%",
    backgroundColor:"#39445a",
    border:"1px solid #282c34",
    borderRadius:"10px",
    color:"white",
    boxShadow:theme.shadows[5],
    padding:theme.spacing(1,1,3)
  },
}));

export default function ContentModal({ children , media_type , id }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [content,setContent] = useState()

  const [video,setVideo] = useState()

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async () => {
    const {data} = await axios.get(`https://api.themoviedb.org/3/${media_type}/${id}?api_key=5b1c34ab42822e20b4c8133dca93621c&language=en-US`)

    setContent(data)
  }

  const fetchVideo = async () => {
    const {data} = await axios.get(`https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=5b1c34ab42822e20b4c8133dca93621c&language=en-US`)

    setVideo(data.results[0]?.key)  //什么写法
  }

  useEffect(() => {
    fetchData()
    fetchVideo()
  },[])

  return (
    <>
      <div type="button" className='media' onClick={handleOpen}>
        {children}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          {content && ( <div className={classes.paper}>
            <div className='ContentModal'>
                <img 
                alt={content.name || content.title}
                className='Content_portrait'
                src={
                    content.poster_path 
                    ? `${img_500}/${content.poster_path}` 
                    : unavailable}
                />
                <img 
                alt={content.name || content.title}
                className='ContentModal_landscape'
                src={
                    content.backdrop_path 
                    ? `${img_500}/${content.backdrop_path}` 
                    : unavailableLandscape}
                />

                <div className='ContentModal_about'>
                    <div className='ContentModal_title'>
                        {content.name || content.title} (
                            {(
                                content.first_air_date ||
                                content.release_date ||
                                "----"
                            ).substring(0,4)}
                        )
                    </div>

                    {content.tagline && (
                        <i className='tagline'>
                            {content.tagline}
                        </i>
                    )}

                    <div className='ContentModal_description'>
                        {content.overview}
                    </div>

                    <div>
                      <Gallery media_type={media_type} id={id}/>
                    </div>

                    <Button
                      variant='contained'
                      startIcon={<YouTube />}
                      color='secondary'
                      target='_blank'
                      href={`https://www.youtube.com/watch?v=${video}`}
                    >
                        Watch the Trailer
                    </Button>

                </div>

            </div>
          </div>
          )}
        </Fade>
      </Modal>
    </>
  );
}
