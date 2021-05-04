import React, { useState, memo, Profiler } from "react";
import "./styles.css";

export default function App() {
  const [user, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const api = `https://randomuser.me/api`;

  const filteredAppState = user.filter(
    (user) =>
      user.name.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.gender.toLowerCase().includes(searchTerm.toLowerCase()) &&
        user.gender.toLowerCase().charAt(0) ===
          searchTerm.toLowerCase().charAt(0))
  );

  const addUserHandler = async () => {
    const userData = await fetch(api, {
      method: "GET"
    });

    const userJson = await userData.json();

    // console.log(userJson.results[0]);

    const newUser = [...user, userJson.results[0]];

    setUser(newUser);
  };

  return (
    <div>
      <Button clickHandler={addUserHandler} name={"Add User"} />
      <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Profiler
        id="userList"
        onRender={(id, phase, actualDuration) => {
          // console.log({ id, phase, actualDuration });
        }}
      >
        <UserList user={filteredAppState} />
      </Profiler>
    </div>
  );
}

const SearchInput = ({ searchTerm, setSearchTerm }) => {
  return (
    <input
      name="searchTerm"
      type="text"
      placeholder="Enter the name or email"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};

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
