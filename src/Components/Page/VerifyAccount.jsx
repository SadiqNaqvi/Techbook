import { useNavigate, useParams } from "react-router-dom";
import Loading from "../Component/Loading";
import { useEffect } from "react";
import { doc, collection, getDocs, updateDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function VerifyAccount(props) {
    const { verifyKey } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const userKey = verifyKey.split('-')[0].replaceAll('u:', '');
        const uniqueKey = verifyKey.split('-')[1].replaceAll('k:', '');
        const accountVerifyLinkData = JSON.parse(localStorage.getItem('QC-Techbook-AccountVerifyLinkData'));
        if (uniqueKey && userKey && accountVerifyLinkData && accountVerifyLinkData.email === props.user?.email && accountVerifyLinkData.key === uniqueKey && accountVerifyLinkData.date === new Date().toLocaleDateString()) {
            getDocs(query(collection(db, "users"), where("uid", "==", userKey)))
                .then((res) => {
                    if (res.empty) {
                        props.updateNotification({ type: "red", msg: "Session Expired." });
                        localStorage.removeItem('QC-Techbook-AccountVerifyLinkData');
                        navigate('/home');
                    } else {
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
            props.updateNotification({ type: "red", msg: "Session Expired. Send verification link again." });
            navigate('/home');
            localStorage.removeItem('QC-Techbook-AccountVerifyLinkData');
        }
    }, []);

    return (
        <Loading use="loading" />
    )
}
