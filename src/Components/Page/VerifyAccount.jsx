import { useNavigate, useParams } from "react-router-dom";
import Loading from "../Component/Loading";
import { useEffect } from "react";
import { doc, collection, getDocs, updateDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function VerifyAccount(props) {
    const { verifyKey } = useParams();
    const navigate = useNavigate();

    useEffect(() => {

        // Get user's key and unique key.
        const userKey = verifyKey.split('-')[0].replaceAll('u:', '');
        const uniqueKey = verifyKey.split('-')[1].replaceAll('k:', '');

        // Get the saved Account verification link data for further process.
        const accountVerifyLinkData = JSON.parse(localStorage.getItem('QC-Techbook-AccountVerifyLinkData'));

        // Check if all the provided keys match with their respective variables of the saved data.
        if (uniqueKey && userKey && accountVerifyLinkData && window.atob(accountVerifyLinkData.email) === props.user?.email && window.atob(accountVerifyLinkData.key) === uniqueKey && accountVerifyLinkData.date === new Date().toLocaleDateString()) {

            // Check if there is any user with the user provider user key.
            getDocs(query(collection(db, "users"), where("uid", "==", userKey)))
                .then((res) => {
                    // If res is empty, means there's no user exist with the provider user key.
                    if (res.empty) {
                        props.updateNotification({ type: "red", msg: "Session Expired." });

                        localStorage.removeItem('QC-Techbook-AccountVerifyLinkData');

                        navigate('/home');

                    } else {

                        // Now since the user is found with the provided user key, Update this user.
                        updateDoc(doc(db, 'users', res.docs[0].id), { ...res.docs[0].data(), isVerified: true })
                            .then(() => {
                                props.changeUser({ ...props.user, isVerified: true });

                                localStorage.removeItem('QC-Techbook-AccountVerifyLinkData');

                                props.updateNotification({ type: "green", msg: "Account Verified. Enjoy your secure digital space. " });
                            }).catch(err => {
                                console.log(err);

                                props.updateNotification({ type: "red", msg: "Something went wrong. Please refresh the page." });
                            });
                    }
                }).catch(err => {
                    console.error(err);

                    props.updateNotification({ type: "red", msg: "Something went wrong. Please refresh the page." });
                });
        } else {
            // If the keys fail to match, remove the saved credentials and ask the user to request again.
            props.updateNotification({ type: "red", msg: "Session Expired. Send verification link again." });

            localStorage.removeItem('QC-Techbook-AccountVerifyLinkData');
            
            navigate('/home');
        }
    }, []);

    return (
        <Loading use="loading" />
    )
}
