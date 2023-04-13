import {
  initializeApp,
  type FirebaseOptions,
  FirebaseError,
} from "firebase/app";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { type Expense } from "@/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig as FirebaseOptions);

export const auth = getAuth(app);

export const db = getDatabase(app);

export const getCurrentUser = async () => {
  return auth.currentUser;
};

export async function signUp(name: string, email: string, password: string) {
  let error = null;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      await set(ref(db, `users/${userCredential.user.uid}`), {
        name,
        email,
        password,
      });
    }
  } catch (e) {
    if (e instanceof FirebaseError) {
      if (e.code === "auth/email-already-in-use") {
        error = "Email already registered!";
      } else error = e.message;
    }
  }

  return error;
}

export async function signIn(email: string, password: string) {
  let error = null;
  try {
    await setPersistence(auth, browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    if (e instanceof FirebaseError) {
      if (e.code === "auth/too-many-requests") {
        error = "Too many requests!";
      } else if (e.code === "auth/wrong-password") {
        error = "Wrong e-mail or password!";
      } else if (e.code === "auth/user-not-found") {
        error = "User not found!";
      } else {
        error = e.message;
      }
    }
  }
  return error;
}

const google = new GoogleAuthProvider();
export const googleSignIn = async () => {
  let error = null;
  try {
    const result = await signInWithPopup(auth, google);
    const user = result.user;

    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}`);
    const userData = {
      displayName: user.displayName,
      email: user.email,
      provider: user.providerId,
    };
    await set(userRef, userData);
  } catch (e) {
    if (e instanceof FirebaseError) {
      error = e.message;
    }
  }
  return error;
};

export async function signOut() {
  await firebaseSignOut(auth);
}

export const getExpenses = async (uid: string) => {
  return new Promise<Expense[]>((resolve, reject) => {
    const database = getDatabase();
    const expensesRef = ref(database, `expenses/${uid}`);

    onValue(
      expensesRef,
      (snapshot) => {
        const expenses: Expense[] = [];
        snapshot.forEach((childSnapshot) => {
          const expense = childSnapshot.val();
          expenses.push(expense);
        });
        resolve(expenses);
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const addExpense = async (uid: string, expense: Expense) => {
  let error = null;
  try {
    const expenseRef = push(ref(db, `expenses/${uid}`));
    const id = push(expenseRef).key;
    await set(expenseRef, { ...expense, id });
  } catch (e) {
    if (e instanceof FirebaseError) {
      error = e.message;
    }
  }
  return error;
};
