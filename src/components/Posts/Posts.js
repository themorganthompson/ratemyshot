import React, { useState, useEffect } from "react";
import realTime from "../../firebase/firebase";
import Post from "./Post";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FlatButton from 'material-ui/FlatButton';
import InputLabel from "@material-ui/core/InputLabel";
import Box from "@material-ui/core/Box";
import Popover from "@material-ui/core/Popover";
import cameraLogo from "../../static/camera-two.svg";
import lens from "../../static/lens.svg";
import aperture from "../../static/aperture.svg";
import category from "../../static/label.svg";
import filter from "../../static/filter.svg";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { FormControl } from "@material-ui/core";

const Posts = (props) => {
  let postz = [];
  let ordered = [];
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  const [cameraList, setCameraList] = useState([]);
  const [lensList, setLensList] = useState([]);
  const [apertureList, setApertureList] = useState([]);
  const [lensValue, setLensValue] = useState("");
  const [apertureValue, setApertureValue] = useState("");
  const [cameraValue, setCameraValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [filterValue, setFilterValue] = useState({ value: "", key: "" });
  const [sort, setSort] = useState({ sort: "average", order: "desc" });

  const getPosts = async (mounted) => {
    let postCameras = [];
    let postLens = [];
    let postAperture = [];
    if (filterValue.value !== "") {
      await realTime
        .ref("posts")
        .orderByChild(filterValue.key)
        .equalTo(filterValue.value)
        .on("value", (snapshot) => {
          if (snapshot.val()) {
            postz.push(snapshot.val());
            let keys = Object.keys(postz[0]);
            var result = Object.keys(postz[0]).map(function (key) {
              return [Number(key), postz[0][key]];
            });
            result.forEach(function (child, i) {
              ordered.push({
                index: i,
                key: keys[i],
                submitted: child[1].submitted,
                imageLink: child[1].imageLink,
                aperture: child[1].aperture,
                lens: child[1].lens,
                camera: child[1].camera,
                category: child[1].category,
                caption: child[1].caption,
                oneStar: child[1].oneStar,
                twoStars: child[1].twoStars,
                threeStars: child[1].threeStars,
                fourStars: child[1].fourStars,
                fiveStars: child[1].fiveStars,
                total: child[1].total,
                average:
                  (5 * child[1].fiveStars +
                    4 * child[1].fourStars +
                    3 * child[1].threeStars +
                    2 * child[1].twoStars +
                    1 * child[1].oneStar) /
                  (child[1].fiveStars +
                    child[1].fourStars +
                    child[1].threeStars +
                    child[1].twoStars +
                    child[1].oneStar),
              });
            });
          }
        });
    } else {
      await realTime
        .ref("posts")
        .orderByChild(sort.sort)
        .on("value", (snapshot) => {
          if (snapshot.val()) {
            postz.push(snapshot.val());
            let keys = Object.keys(postz[0]);
            var result = Object.keys(postz[0]).map(function (key) {
              return [Number(key), postz[0][key]];
            });
            result.forEach(function (child, i) {
              postCameras.push(child[1].camera);
              postLens.push(child[1].lens);
              postAperture.push(child[1].aperture);
              ordered.push({
                index: i,
                key: keys[i],
                submitted: child[1].submitted,
                imageLink: child[1].imageLink,
                aperture: child[1].aperture,
                lens: child[1].lens,
                camera: child[1].camera,
                category: child[1].category,
                caption: child[1].caption,
                oneStar: child[1].oneStar,
                twoStars: child[1].twoStars,
                threeStars: child[1].threeStars,
                fourStars: child[1].fourStars,
                fiveStars: child[1].fiveStars,
                total: child[1].total,
                average:
                  (5 * child[1].fiveStars +
                    4 * child[1].fourStars +
                    3 * child[1].threeStars +
                    2 * child[1].twoStars +
                    1 * child[1].oneStar) /
                  (child[1].fiveStars +
                    child[1].fourStars +
                    child[1].threeStars +
                    child[1].twoStars +
                    child[1].oneStar),
              });
            });
          }
        });
    }

    if (mounted) {
      if (!filterValue.value) {
        setCameraList([...new Set(postCameras)]);
        setLensList([...new Set(postLens)]);
        setApertureList([...new Set(postAperture)]);
      }
      switch (sort.order) {
        case "desc":
          setPosts(
            ordered.sort((a, b) => (a[sort.sort] > b[sort.sort] ? 1 : -1))
          );
          break;
        case "asc":
          setPosts(
            ordered.sort((a, b) => (a[sort.sort] < b[sort.sort] ? 1 : -1))
          );
          break;
        default:
          setPosts(
            ordered.sort((a, b) => (a[sort.sort] > b[sort.sort] ? 1 : -1))
          );
          break;
      }
    }
    return ordered;
  };

  const updateFilter = (value, key) => {
    setFilterValue({ key: key, value: value });
  };

  useEffect(
    () => {
      let mounted = true;
      getPosts(mounted);
      return () => (mounted = false);
      // eslint-disable-next-line
    },
    [posts],
    props.isVerifying
  );

  const updateRating = (post, key, rating) => {
    setPostLoading({ key: key, loading: true });
    if (rating === 1) {
      props.firebase.ref("posts/" + key).update({
        oneStar: post.oneStar + 1,
        total: post.total + 1,
      });
    } else if (rating === 2) {
      props.firebase.ref("posts/" + key).update({
        twoStars: post.twoStars + 1,
        total: post.total + 1,
      });
    } else if (rating === 3) {
      props.firebase.ref("posts/" + key).update({
        threeStars: post.threeStars + 1,
        total: post.total + 1,
      });
    } else if (rating === 4) {
      props.firebase.ref("posts/" + key).update({
        fourStars: post.fourStars + 1,
        total: post.total + 1,
      });
    } else if (rating === 5) {
      props.firebase.ref("posts/" + key).update({
        fiveStars: post.fiveStars + 1,
        total: post.total + 1,
      });
    }
    setPostLoading(false);
  };

  const updateSort = (value, order) => {
    setSort({ sort: value, order: order });
  };

  return (
    <div>
      <div id="sort-pagination">
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div id="filter-popover">
              <img
                id="filterIcon"
                src={filter}
                alt="filter"
                {...bindTrigger(popupState)}
                style={{ float: "right" }}
              />
              <Popover
                marginThreshold={86}
                {...bindPopover(popupState)}
                anchorPosition={{ top: 10, left: 20 }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <Box p={2}>
                  <FormControl
                    variant="outlined"
                    style={{
                      width: "200px",
                      marginTop: "20px",
                    }}
                  >
                    <InputLabel id="demo-simple-select-helper-label">
                      <img
                        alt="camera"
                        src={cameraLogo}
                        width="18px"
                        style={{ verticalAlign: "middle", marginRight: "5px" }}
                      />{" "}
                      <span>Camera</span>
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      onChange={(e) => {
                        setCameraValue(e.target.value);
                        updateFilter(e.target.value, "camera");
                      }}
                      value={cameraValue}
                      label={
                        <span>
                          <img
                            alt="camera"
                            src={cameraLogo}
                            width="18px"
                            style={{
                              verticalAlign: "middle",
                              marginRight: "5px",
                            }}
                          />
                          <span style={{ verticalAlign: "middle" }}>
                            Camera
                          </span>
                        </span>
                      }
                    >
                      <MenuItem value=""> </MenuItem>
                      {cameraList.map((camera, i) => {
                        return (
                          <MenuItem key={i} value={camera}>
                            {camera}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <br />
                  <FormControl
                    variant="outlined"
                    style={{
                      width: "200px",
                      marginTop: "20px",
                    }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      <span>
                        <img
                          alt="lens"
                          src={lens}
                          width="18px"
                          style={{
                            verticalAlign: "middle",
                            marginRight: "5px",
                          }}
                        />
                        <span style={{ verticalAlign: "middle" }}>Lens</span>
                      </span>
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      onChange={(e) => {
                        setLensValue(e.target.value);
                        updateFilter(e.target.value, "lens");
                      }}
                      value={lensValue}
                      label={
                        <span>
                          <img
                            alt="lens"
                            src={lens}
                            width="18px"
                            style={{
                              verticalAlign: "middle",
                              marginRight: "5px",
                            }}
                          />
                          <span style={{ verticalAlign: "middle" }}>Lens</span>
                        </span>
                      }
                    >
                      <MenuItem value=""> </MenuItem>
                      {lensList.map((lens, i) => {
                        return (
                          <MenuItem key={i} value={lens}>
                            {lens}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <br />
                  <FormControl
                    variant="outlined"
                    style={{
                      width: "200px",
                      marginTop: "20px",
                    }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      <span>
                        <img
                          alt="aperture"
                          src={aperture}
                          width="18px"
                          style={{
                            verticalAlign: "middle",
                            marginRight: "5px",
                          }}
                        />
                        <span style={{ verticalAlign: "middle" }}>
                          Aperture
                        </span>
                      </span>
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      onChange={(e) => {
                        setApertureValue(e.target.value);
                        updateFilter(e.target.value, "aperture");
                      }}
                      value={apertureValue}
                      label={
                        <span>
                          <img
                            alt="category"
                            src={aperture}
                            width="18px"
                            style={{
                              verticalAlign: "middle",
                              marginRight: "5px",
                            }}
                          />
                          <span style={{ verticalAlign: "middle" }}>
                            Aperture
                          </span>
                        </span>
                      }
                    >
                      <MenuItem value=""> </MenuItem>
                      {apertureList.map((aperture, i) => {
                        return (
                          <MenuItem key={i} value={aperture}>
                            {aperture}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <br />
                  <FormControl
                    variant="outlined"
                    style={{
                      width: "200px",
                      marginTop: "20px",
                    }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      <span>
                        <img
                          alt="lens"
                          src={category}
                          width="18px"
                          style={{
                            verticalAlign: "middle",
                            marginRight: "5px",
                          }}
                        />
                        <span style={{ verticalAlign: "middle" }}>
                          Category
                        </span>
                      </span>
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      onChange={(e) => {
                        setCategoryValue(e.target.value);
                        updateFilter(e.target.value, "category");
                      }}
                      value={categoryValue}
                      label={
                        <span>
                          <img
                            alt="lens"
                            src={category}
                            width="18px"
                            style={{
                              verticalAlign: "middle",
                              marginRight: "5px",
                            }}
                          />
                          <span style={{ verticalAlign: "middle" }}>
                            Category
                          </span>
                        </span>
                      }
                    >
                      <MenuItem value="">
                        <em>none</em>
                      </MenuItem>
                      <MenuItem value={"automotive"}>automotive</MenuItem>
                      <MenuItem value={"black & white"}>black & white</MenuItem>
                      <MenuItem value={"cityscape"}>cityscape</MenuItem>
                      <MenuItem value={"film"}>film</MenuItem>
                      <MenuItem value={"landscape"}>landscape</MenuItem>
                      <MenuItem value={"nature"}>nature</MenuItem>
                      <MenuItem value={"portrait"}>portrait</MenuItem>
                    </Select>
                  </FormControl>
                  <center>
                    <br />
                    <FlatButton
                      label="RESET"
                      primary={true}
                      className="cancelBtn"
                      onClick={() => {
                        setApertureValue("");
                        setLensValue("");
                        setCameraValue("");
                        setCategoryValue("");
                        setFilterValue({key: "", value: ""});
                      }}
                      style={{ marginBottom: "10px", width: "100%" }}
                    />
                  </center>
                </Box>
              </Popover>
            </div>
          )}
        </PopupState>
      </div>
      <div className="cards">
        {props.isVerifying ? (
          <div id="loader">
            <center>
              <Loader
                style={{ margin: "200px" }}
                type="Oval"
                color="#61dbfb"
                height={60}
                width={60}
              />
            </center>
          </div>
        ) : (
          <div>
            {posts.length > 0
              ? posts.map((post, i) => {
                  return (
                    <Post
                      postLoading={postLoading}
                      showZoomModal={(image) => props.showZoomModal(image)}
                      isAuthenticated={props.isAuthenticated}
                      key={i}
                      id={i}
                      post={post}
                      updateRating={(post, i, rating) =>
                        updateRating(post, post.key, rating)
                      }
                    />
                  );
                })
              : null}
          </div>
        )}
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
  };
}

export default connect(mapStateToProps)(Posts);
