import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  TextField,
  Button,
  Popover,
  Snackbar,
  SnackbarContent,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import { selectNewsData, fetchNewsData, updateNewsData } from "../../app/NewsSlice";
import { baseTheme } from "../../assets/global/Theme-variable";

const EditNews = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { newsId: newsIdParam } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileError, setFileError] = useState(""); // State for file error message

  const [data, setData] = useState({
    newsTitle: "",
    newsInfo: "",
    newsDate: "",
    mediaPath: file,
    isPublished: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch(updateNewsData(data.newsId, data))
      .then(() => {
        toggleEditMode();
        setIsSuccess(true)
        showSnackbar('News updated successfully!');
        console.log(data)

        setTimeout(() => {
          navigate("../news");
        }, 1000);
      })

      .catch((error) => {
        setIsSuccess(false);
        showSnackbar('Error in updating news. Please try again.');
        console.error('Error in updating news:', error);
      });
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (files.length > 0) {
      const selectedFile = files[0];
      const allowedExtensions = ['jpg', 'png', 'webp', 'jpeg'];
      const fileNameParts = selectedFile.name.split('.');
      const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();

      // Check if the file extension is allowed
      if (allowedExtensions.includes(fileExtension)) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFile(event.target.result);
          setData((prevData) => ({
            ...prevData,
            [name]: event.target.result,
          }));
          setFileError(""); // Reset file error
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // Set file error message for invalid file extension
        setFileError("Please select a JPG, PNG, WEBP, or JPEG image.");
      }
    }
  };

  const [loading, setLoading] = useState(true);
  const newsData = useSelector(selectNewsData);

  const fetchNewsDataById = () => {
    const newsId = parseInt(newsIdParam);
    const selectedNews = newsData.find((news) => news.newsId === newsId);
    setData({ ...selectedNews });
    setLoading(false);
  };

  useEffect(() => {
    if (newsData.length === 0) {
      dispatch(fetchNewsData());
    } else {
      fetchNewsDataById();
    }
  }, [newsIdParam, dispatch, newsData]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if (!isSuccess) {
      setSnackbarOpen(false);
    }
  };

  const showSnackbar = (message) => {
    setSnackbarOpen(true);
  };

  const handleImageClick = (event) => {
    setPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const handleImageChange = () => {
    const fileInput = document.getElementById("mediaPath");
    if (fileInput) {
      fileInput.click();
    }
  };

  const toggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">Edit News - {data && data.newsId}</Typography>
        <br />
        <Divider />
        <br />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Card
                variant="outlined"
                sx={{
                  height: "150px",
                  width: "210px",
                  textAlign: "center",
                }}
              >
                <img
                  src={file || (data && data.mediaPath)}
                  alt="Preview"
                  id="image"
                  name="mediaPath"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "130px",
                    marginRight: "10px",
                    marginTop: "auto",
                  }}
                  onClick={handleImageClick}
                />
                {editMode && (
                  <Popover
                    open={Boolean(popoverAnchor)}
                    anchorEl={popoverAnchor}
                    onClose={handlePopoverClose}
                    disabled={!editMode}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <input
                      type="file"
                      id="mediaPath"
                      name="mediaPath"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={handleImageChange}
                      startIcon={<AddIcon />}
                    >
                      Change
                    </Button>
                  </Popover>
                )}
              </Card>
              {fileError && (
                <Typography variant="body2" color="error">
                  {fileError}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                variant="outlined"
                name='newsTitle'
                onChange={handleTextChange}
                fullWidth
                value={data && data.newsTitle}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Info"
                variant="outlined"
                name='newsInfo'
                onChange={handleTextChange}
                fullWidth
                value={data && data.newsInfo}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="news Details"
                variant="outlined"
                name='newsDate'
                onChange={handleTextChange}
                fullWidth
                value={data && data.newsDate}
                disabled={!editMode}

              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" required sx={{ mb: 2 }}>
                <InputLabel htmlFor="status">Status</InputLabel>
                <Select
                  label="Status"
                  variant="outlined"
                  name='isPublished'
                  onChange={handleTextChange}
                  fullWidth
                  value={data && data.isPublished}
                  disabled={!editMode}
                >
                  <MenuItem value="1">Active</MenuItem>
                  <MenuItem value="0">Inactive</MenuItem>
                  <MenuItem value="2">Progress</MenuItem>
                </Select>
              </FormControl>

            </Grid>

          </Grid>
          <br />
          <Divider />
          <br />
          {editMode ? (
            <>
              <Button variant="contained" color="success" type="submit" onSubmit={handleSubmit}>
                Save
              </Button>
              <Button variant="contained" color="error" sx={{ ml: 1 }} onClick={toggleEditMode}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={toggleEditMode}>
              Edit
            </Button>
          )}
        </form>

        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
        >
          <SnackbarContent
            message="News updated successfully!"
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackbarClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{
              backgroundColor: isSuccess
                ? baseTheme.palette.success.main
                : baseTheme.palette.error.main,
              color: isSuccess ? '#fff' : undefined,
            }}
          />
        </Snackbar>

      </CardContent>
    </Card>
  );
};

export default EditNews;
