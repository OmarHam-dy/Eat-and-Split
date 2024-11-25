import { useState } from "react";

export default function App() {
  return (
    <div className="App">
      <EatAndSplit />
    </div>
  );
}

function EatAndSplit() {
  const [selectedId, setSelectedId] = useState(null);
  const [friends, setFriends] = useState([
    {
      id: 1,
      name: "Omar",
      img: "https://www.sacombank.com.kh/wp-content/uploads/2017/11/personal-website-design-Copy.png",
      debt: 90,
    },
    {
      id: 2,
      name: "Ahemd",
      img: "https://www.sacombank.com.kh/wp-content/uploads/2017/11/personal-website-design-Copy.png",
      debt: -50,
    },
    {
      id: 3,
      name: "Khaled",
      img: "https://www.sacombank.com.kh/wp-content/uploads/2017/11/personal-website-design-Copy.png",
      debt: 30,
    },
    {
      id: 4,
      name: "Yosra",
      img: "https://www.sacombank.com.kh/wp-content/uploads/2017/11/personal-website-design-Copy.png",
      debt: -10,
    },
  ]);

  const addFriend = function (friend) {
    setFriends((f) => [...f, friend]);
  };
  const updateFriend = function (updatedFriend) {
    setFriends((friends) =>
      friends.map((f) => (f.id === selectedId ? updatedFriend : f))
    );
    setSelectedId(null);
  };
  const toggleSelectedId = function (id) {
    if (selectedId === id) setSelectedId(null);
    else setSelectedId(id);
  };
  const getFriend = () => friends.find((friend) => friend.id === selectedId);

  return (
    <>
      <FriendsList
        friends={friends}
        onAddFriend={addFriend}
        selectedId={selectedId}
        onToggleSelectedId={toggleSelectedId}
      />
      <Split
        friend={selectedId ? getFriend() : null}
        onUpdateFriend={updateFriend}
        key={selectedId} // This addition in section of "How React works behind the scense"
      />
    </>
  );
}

function FriendsList({ friends, onAddFriend, selectedId, onToggleSelectedId }) {
  return (
    <div className="list">
      <div>
        {friends.map((friend) => (
          <Friend
            key={friend.id}
            friend={friend}
            selectedId={selectedId}
            onToggleSelectedId={onToggleSelectedId}
          />
        ))}
      </div>
      <AddFrind onAddFriend={onAddFriend} />
    </div>
  );
}

function AddFrind({ onAddFriend }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState(
    "https://www.sacombank.com.kh/wp-content/uploads/2017/11/personal-website-design-Copy.png"
  );
  const [isOpened, setIsOpened] = useState(false);
  const friend = {
    id: Date.now(),
    name: name,
    img: img,
    debt: 0,
  };

  const clear = function () {
    setName("");
    setImg(
      "https://www.sacombank.com.kh/wp-content/uploads/2017/11/personal-website-design-Copy.png"
    );
  };
  const handleAddFriend = function () {
    if (name === "" || img === "") {
      alert("Fill the required fields !");
      return;
    }

    onAddFriend(friend);
    clear();
    setIsOpened(false);
  };

  return (
    <div className="add-friend">
      <div className={`form ${isOpened ? "open" : ""}`}>
        <Input
          type={"text"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        >
          👫 Friend Name{" "}
        </Input>
        <Input
          type={"text"}
          value={img}
          onChange={(e) => setImg(e.target.value)}
        >
          📸 Image URL{" "}
        </Input>
        <Button padding={"70px"} onClick={handleAddFriend}>
          Add friend
        </Button>
      </div>
      <Button padding={"10px"} onClick={() => setIsOpened((is) => !is)}>
        {isOpened ? "Close" : "Add Friend"}
      </Button>
    </div>
  );
}

function Split({ friend, onUpdateFriend }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState(0);
  const [payer, setPayer] = useState("you");

  if (!friend)
    return (
      <div>
        <div className="split hidden"></div>
      </div>
    );

  const clear = function () {
    setBill("");
    setMyExpense("");
    setPayer("you");
  };

  const handleClick = function () {
    onUpdateFriend({
      ...friend,
      debt:
        payer === "you"
          ? friend.debt + (bill - myExpense)
          : friend.debt - myExpense,
    });
    clear();
  };

  const handleBill = function (e) {
    const value = +e.target.value;
    if (value >= 0) setBill(value);
  };

  const handleMyExpense = function (e) {
    const value = +e.target.value;
    if (value <= bill && value >= 0) setMyExpense(value);
  };

  return (
    <div>
      <div className="split">
        <h2>SPLIT A BILL WITH {friend.name}</h2>
        <Input type={"number"} value={bill} onChange={handleBill}>
          💰 Bill Value
        </Input>
        <Input type={"number"} value={myExpense} onChange={handleMyExpense}>
          {" "}
          🧍‍♂️ Your Expense
        </Input>
        <Input type={"number"} disabled={true} value={bill - myExpense}>
          {" "}
          👨🏼‍🤝‍👨🏼 {friend.name}'s Expense{" "}
        </Input>{" "}
        {/* setValue={setState} --> not make sense, this is better and make you able to make different validations on the use input -> onChnage={handleState} */}
        <Select
          friend={friend.name}
          value={payer}
          onChange={(e) => setPayer(e.target.value)}
        >
          🤑 Who will pay the bill?{" "}
        </Select>
        <Button padding={"10px"} onClick={handleClick}>
          Split Bill
        </Button>
      </div>
    </div>
  );
}

function Friend({ friend, selectedId, onToggleSelectedId }) {
  const getMsgDebt = function () {
    if (friend.debt === 0)
      return <p style={{ color: "black" }}>You and {friend.name} are even</p>;
    if (friend.debt > 0)
      return (
        <p style={{ color: "green" }}>
          {friend.name} owes you ${friend.debt}
        </p>
      );
    return (
      <p style={{ color: "red" }}>
        You owe {friend.name} ${-friend.debt}
      </p>
    );
  };

  return (
    <div className={`item ${selectedId === friend.id ? "active" : ""}`}>
      <div className="content">
        <div className="image">
          <img src={friend.img} alt={`personal ${friend.id}`} />
        </div>
        <div className="info">
          <h3>{friend.name}</h3>
          {getMsgDebt()}
        </div>
      </div>
      <Button padding={"30px"} onClick={() => onToggleSelectedId(friend.id)}>
        {selectedId === friend.id ? "close" : "select"}
      </Button>
    </div>
  );
}

// Reusable Components
function Button({ padding, onClick, children }) {
  return (
    <button
      className="btn"
      style={{ paddingRight: padding, paddingLeft: padding }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Input({ type, value, disabled = false, onChange, children }) {
  return (
    <div className="input">
      <label>{children}</label>
      <input
        type={type}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function Select({ friend, value, onChange, children }) {
  return (
    <div className="select">
      <label>{children}</label>
      <select value={value} onChange={onChange}>
        <option value="you">You</option>
        <option value={friend}>{friend}</option>
      </select>
    </div>
  );
}
