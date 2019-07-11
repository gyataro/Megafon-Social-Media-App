const functions = require('firebase-functions');

const express   = require('express');
const app = express();

const FBAuth = require('./util/fbAuth');
const cors = require('cors');
app.use(cors());

const { db } = require('./util/admin');

const { 
    getAllShouts, 
    postOneShout,
    getShout,
    deleteShout,
    commentOnShout,
    likeShout,
    unlikeShout
} = require('./handlers/shouts');

const { 
    signUp, 
    login, 
    uploadImage, 
    addUserDetails, 
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead
} = require('./handlers/users'); 

const SERVER_REGION = 'asia-east2';

//Shout routes
app.get('/shouts', getAllShouts);
app.post('/shout', FBAuth, postOneShout);
app.get('/shout/:shoutId', getShout);
app.delete('/shout/:shoutId', FBAuth, deleteShout);
app.get('/shout/:shoutId/like', FBAuth, likeShout);
app.get('/shout/:shoutId/unlike', FBAuth, unlikeShout);
app.post('/shout/:shoutId/comment', FBAuth, commentOnShout);

//User authentication route
app.post('/signup', signUp);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.region(SERVER_REGION).https.onRequest(app);

exports.createNotificationOnLike = functions.region(SERVER_REGION).firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/shouts/${snapshot.data().shoutId}`)
            .get()
            .then(doc => {
                if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        read: false,
                        shoutId: doc.id
                    });
                }
            })
            .catch(err => {
                console.error(err);
                return;
            })
    });

exports.deleteNotificationOnUnlike = functions.region(SERVER_REGION).firestore.document('likes/{id}')
    .onDelete((snapshot) => {
        return db.doc(`/notifications/${snapshot.data().shoutId}`)
            .delete()
            .catch(err => {
                console.error(err);
                return;
            })
    });

exports.createNotificationOnComment = functions.region(SERVER_REGION).firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/shouts/${snapshot.data().shoutId}`)
            .get()
            .then(doc => {
                if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'comment',
                        read: false,
                        shoutId: doc.id
                    });
                }
            })
            .catch(err => {
                console.error(err);
                return;
            })
    });

exports.onUserImageChange = functions.region(SERVER_REGION).firestore.document(`/users/{userId}`)
    .onUpdate((change) => {
        if(change.before.data().imageUrl !== change.after.data().imageUrl){
            let batch = db.batch();
            return db.collection('shouts').where('userHandle', '==', change.before.data().handle).get()
                .then(data => {
                    data.forEach(doc => {
                        const shout = db.doc(`/shouts/${doc.id}`);
                        batch.update(shout, {userImage: change.after.data().imageUrl});
                    })
                    return batch.commit();
                })
        } else return true;
    });

exports.onShoutDelete = functions.region(SERVER_REGION).firestore.document(`/shouts/{shoutId}`)
    .onDelete((snapshot, context) => {
        const shoutId = context.params.shoutId;
        const batch = db.batch();
        return db.collection('comments').where('shoutId', '==', shoutId).get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                })
                return db.collection('likes').where('shoutId', '==', shoutId).get()
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/likes/${doc.id}`));
                })
                return db.collection('notifications').where('shoutId', '==', shoutId).get()
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/notifications/${doc.id}`));
                })
                return batch.commit();
            })
            .catch(err => {
                console.error(err);
            })
    })