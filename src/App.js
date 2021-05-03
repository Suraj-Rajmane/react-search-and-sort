import React, { useState, memo, Profiler, useEffect } from "react";
import "./styles.css";

export default function App() {
  const [user, setUser] = useState([]);
  const [searchedUser, setSearchedUser] = useState(user);
  const [search, setSearch] = useState("");

  const api = `https://randomuser.me/api`;

  useEffect(() => {
    const searchInputHandler = () => {
      const filteredAppState = user.filter(
        (user) =>
          user.name.first.toLowerCase().includes(search.toLowerCase()) ||
          user.name.last.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          (user.gender.toLowerCase().includes(search.toLowerCase()) &&
            user.gender.toLowerCase().charAt(0) ===
              search.toLowerCase().charAt(0))
      );

      setSearchedUser(filteredAppState);
    };

    searchInputHandler();
  }, [search, user]);

  const addUserHandler = async () => {
    const userData = await fetch(api, {
      method: "GET"
    });

    const userJson = await userData.json();

    // console.log(userJson.results[0]);

    const newUser = [...user, userJson.results[0]];

    setUser(newUser);
    setSearchedUser(user);
  };

  const searchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <Button clickHandler={addUserHandler} name={"Add User"} />
      {/* <Button clickHandler={searchInputHandler} name={"Search"}/> */}
      <input
        name="search"
        type="text"
        placeholder="search"
        value={search}
        onChange={searchChange}
      />

      <Profiler
        id="userList"
        onRender={(id, phase, actualDuration) => {
          // console.log({ id, phase, actualDuration });
        }}
      >
        <UserList user={searchedUser} />
      </Profiler>
    </div>
  );
}

const Button = memo(({ clickHandler, name }) => {
  return <button onClick={clickHandler}>{name}</button>;
});

const UserList = ({ user }) => {
  return (
    <div>
      {user.map((userObj, index) => (
        <UserObject userObj={userObj} key={index} />
      ))}
    </div>
  );
};

const UserObject = ({ userObj }) => {
  return (
    <div>
      {userObj.name.title} {userObj.name.first} {userObj.name.last}
      <ol>
        <li>{userObj.gender}</li>
        <li>{userObj.email}</li>
      </ol>
    </div>
  );
};
