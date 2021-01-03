import React, { Component, useState } from "react";

import { Link, Redirect } from "react-router-dom";
import { fade, makeStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";

import Swal from "sweetalert2";
import "@sweetalert2/theme-dark/dark.css";

import axios from "axios";

import { uuid } from "../components";

export default class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: {},
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      categories: {},
      isLoaded: false,
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
    };
  }

  async componentDidMount() {
    let { auth, server } = this.state;
    let url = `${server}/api/v1/environment?a=${auth}`;

    axios.get(url).then((response) =>
      this.setState({
        accounts: response.data.account_list,
        categories: response.data.category_list,
        isLoaded: true,
      })
    );
  }

  render() {
    let { accounts, categories, isLoaded } = this.state;

    return isLoaded ? (
      <div className="Nav">
        <NavUI
          props={{
            categories: categories,
            accounts: accounts,
          }}
        />
      </div>
    ) : (
      <div className="Loading" style={{ display: "none" }}></div>
    );
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#1f1f1f",
    color: "#ffffff",
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  browse: {
    marginRight: "15px",
  },
}));

export function NavUI(props) {
  const classes = useStyles();

  const [search, setSearch] = useState("");
  const searchChange = (evt) => {
    setSearch(evt.target.value);
  };

  const searchSubmit = (evt) => {
    evt.preventDefault();
    window.location.hash = `#/search/${search}`;
  };

  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <Link to="/" className="no_decoration_link">
            <Typography className={classes.title} variant="h6" noWrap>
              libDrive
            </Typography>
          </Link>
          <form className={classes.search} onSubmit={searchSubmit}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={searchChange}
            />
          </form>
          <div className={classes.grow} />
          <BrowseMenu props={props.props.categories} />
          <AccountMenu props={props.props.accounts} />
        </Toolbar>
      </AppBar>
    </div>
  );
}

export function BrowseMenu(props) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const classes = useStyles();

  const handleClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <div className={classes.browse}>
      <Button
        aria-controls="browse-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Browse
      </Button>
      <Menu
        id="browse-menu"
        anchorEl={menuAnchorEl}
        keepMounted
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(menuAnchorEl)}
        onClose={handleClose}
      >
        <Link to={"/"} className="no_decoration_link">
          <MenuItem onClick={handleClose}>Home Page</MenuItem>
        </Link>
        <Divider light />
        {props.props.length
          ? props.props.map((category) => (
              <Link
                to={`/browse/${category.name}`}
                key={uuid()}
                className="no_decoration_link"
              >
                <MenuItem onClick={handleClose}>{category.name}</MenuItem>
              </Link>
            ))
          : null}
      </Menu>
    </div>
  );
}

export function AccountMenu(props) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  let pic = <AccountCircle />;
  if (props.props.pic.includes("http") || props.props.pic.includes("www")) {
    pic = <img src={props.props.pic} width="32px" alt="profile-pic"></img>;
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="account-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {pic}
      </IconButton>
      <Menu
        id="account-menu"
        anchorEl={menuAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleClose}
      >
        <Link to={"/settings"} className="no_decoration_link">
          <MenuItem onClick={handleClose}>Settings</MenuItem>
        </Link>
        <Link to={"/logout"} className="no_decoration_link">
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Link>
      </Menu>
    </div>
  );
}
