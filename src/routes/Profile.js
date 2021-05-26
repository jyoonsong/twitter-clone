import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { authService, dbService } from "../fbase";

const Profile = ({ userObj, refreshUser }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const history = useHistory()
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }

    const getMyNweets = async () => {
        const nweets = await dbService.collection("nweets")
        .where(
            "creatorId",
            "==",
            userObj.uid
        )
        .orderBy("createdAt")
        .get();

        console.log(nweets.docs.map(doc => doc.data()));
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            // update
            await userObj.updateProfile({
                displayName: newDisplayName,
            });

            refreshUser(userObj);
        }
    }

    const onChange = (event) => {
        const {target: {value}} = event;
        setNewDisplayName(value);
    }

    useEffect(() => {
        getMyNweets();
    }, [])
    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Display name" onChange={onChange} value={newDisplayName} />
                <input type="submit" value="Update profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
}

export default Profile;