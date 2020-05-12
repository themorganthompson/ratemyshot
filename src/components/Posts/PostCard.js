import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Moment from "moment";
import cameraLogo from "../../static/camera-two.svg";
import loyalty from "../../static/loyalty.svg";
import loading from "../../static/loading.gif";
import aperture from "../../static/aperture.svg";
import category from "../../static/label.svg";
import Tooltip from "@material-ui/core/Tooltip";
import lens from "../../static/lens.svg";
import StarRatings from "react-star-ratings";
import Typography from "@material-ui/core/Typography";

const PostCard = (post) => {
  Moment.locale("en");
  const [showZoom, setShowZoom] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const changeRating = (newRating, name) => {
    if (post.isAuthenticated) {
      post.updateRating(post.post, post.post.key, newRating);
    }
  };

  const toggleZoom = (show) => {
    setShowZoom(show);
  };

  return (
    <Card className={"MuiProjectCard--01"} id="post-card">
      <CardMedia
        className={"MuiCardMedia-root"}
        style={{ height: "300px" }}
        image={post.post.imageLink}
        id="cardImage"
        onClick={
          showZoom && !post.adminFlag
            ? () => post.showZoomModal(post.post.imageLink)
            : post.adminFlag
            ? () => post.showEditModal(post.post)
            : null
        }
        onMouseEnter={
          !showZoom && !post.adminFlag
            ? () => toggleZoom(true)
            : null
        }
        onMouseLeave={
          showZoom && !post.adminFlag
          ? () => toggleZoom(false)
          : null
        }
      >
        {showZoom && !post.adminFlag ? (
          <Tooltip title="Zoom">
            <div className="zoomBtn"></div>
          </Tooltip>
        ) : showEdit ? (
          <Tooltip title="Edit">
            <div className="editBtn"></div>
          </Tooltip>
        ) : null}
        {post.adminFlag ? <div id="edit-mobile-only" className="editBtn"></div> : null }
      </CardMedia>
      <div
        id="editor-pick"
        style={{ display: post.post.editorspick ? "block" : "none" }}
      >
        {" "}
        <img
          alt="loyalty"
          src={loyalty}
          width="18px"
          style={{ verticalAlign: "middle", marginRight: "3px" }}
        />{" "}
        Editor's Pick
      </div>
      <div
        className={"MuiCard__head"}
        style={{
          marginBottom: "20px",
          position: post.post.editorspick ? "relative" : "initial",
          top: post.post.editorspick ? "-30px" : "initial",
        }}
      >
        <Typography
          className={"MuiTypography--heading"}
          style={{ marginLeft: "15px", marginTop: "15px", marginBottom: "0px" }}
          gutterBottom
        >
          <span
            style={{ fontSize: "20px", fontWeight: "400", marginBottom: "2px" }}
          >
            {post.post.caption}
          </span>
          <span
            style={{
              backgroundColor: "#EEEEEE",
              padding: "10px",
              borderRadius: "4px",
              width: "100px",
              overflow: "scroll",
              float: "right",
              zIndex: "1",
              fontSize: "10px",
              fontStyle: "italic",
              marginRight: "20px",
              marginTop: "6px"
            }}
          >
            <img
              alt="camera"
              src={cameraLogo}
              width="18px"
              style={{ verticalAlign: "middle", marginRight: "3px" }}
            />{" "}
            {post.post.camera}
            <br />
            <img
              alt="aperture"
              src={aperture}
              width="18px"
              style={{ verticalAlign: "middle", marginRight: "3px" }}
            />{" "}
            {post.post.aperture}
            <br />
            <img
              alt="lens"
              src={lens}
              width="18px"
              style={{ verticalAlign: "middle", marginRight: "3px" }}
            />{" "}
            {post.post.lens}
            <br />
            <img
              alt="category"
              src={category}
              width="18px"
              style={{ verticalAlign: "middle", marginRight: "3px" }}
            />{" "}
            {post.post.category}
          </span>
        </Typography>
        <Tooltip title="Rate!" placement="right">
          <Typography
            className={"MuiTypography--headLabel"}
            variant={"overline"}
            gutterBottom
            style={{ margin: "5px", fontSize: "11px", paddingLeft: "10px" }}
          >
            <StarRatings
              rating={post.post.average ? post.post.average : 0}
              starRatedColor="#212121"
              starHoverColor="#212121"
              changeRating={(rating) => changeRating(rating)}
              numberOfStars={5}
              name="rating"
              starDimension="15px"
            />
            <span style={{ marginLeft: "5px", fontSize: "13px" }}>
              {post.postLoading && post.postLoading.key === post.post.key ? (
                <img
                  width="19px"
                  style={{ verticalAlign: "middle", paddingBottom: "2px" }}
                  src={loading}
                  alt="loading"
                />
              ) : null}
            </span>
          </Typography>
        </Tooltip>
        <br />
        <Typography
          className={"MuiTypography--overline"}
          variant={"overline"}
          style={{
            marginLeft: "15px",
            fontSize: "13px",
            textTransform: "none",
          }}
          gutterBottom
        >
          {Moment(new Date(post.post.submitted)).format("MMMM D, YYYY")}
        </Typography>
      </div>
    </Card>
  );
};

export default PostCard;
