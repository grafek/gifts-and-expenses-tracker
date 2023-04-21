import {
  initializeApp,
  type FirebaseOptions,
  FirebaseError,
} from "firebase/app";
import {
  get,
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
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
    const expensesRef = ref(db, `expenses/${uid}`);

    onValue(
      expensesRef,
      (snapshot) => {
        let expenses: Expense[] = [];
        snapshot.forEach((childSnapshot) => {
          const expense = childSnapshot.val();
          expenses = [...expenses, expense];
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
  let error: string | null = null;
  try {
    const expensesRef = ref(db, `expenses/${uid}`);
    const snapshot = await get(expensesRef);
    let existingExpense: Partial<Expense> = {};

    snapshot.forEach((childSnapshot) => {
      const expenseId = childSnapshot.key;
      const expenseData = childSnapshot.val();
      if (
        expenseData.name === expense.name &&
        expenseData.year === expense.year &&
        expenseData.month === expense.month
      ) {
        existingExpense = { id: expenseId, ...expenseData };
      }
    });

    if (existingExpense && existingExpense.value) {
      existingExpense.value += expense.value;
      const expenseRef = ref(db, `expenses/${uid}/${existingExpense["id"]}`);
      await update(expenseRef, existingExpense);
    } else {
      const newExpenseRef = push(expensesRef);
      const id = newExpenseRef.key;
      await set(newExpenseRef, { ...expense, id });
    }
  } catch (e) {
    if (e instanceof FirebaseError) {
      error = e.message;
    }
  }
  return error;
};

export const updateExpense = async (uid: string, expense: Expense) => {
  let error: string | null = null;
  try {
    const expensesRef = ref(db, `expenses/${uid}`);
    const snapshot = await get(expensesRef);
    let existingExpense: Partial<Expense> = {};

    snapshot.forEach((childSnapshot) => {
      const expenseId = childSnapshot.key;
      const expenseData = childSnapshot.val();
      if (
        expenseData.name === expense.name &&
        expenseData.year === expense.year &&
        expenseData.month === expense.month
      ) {
        existingExpense = { id: expenseId, ...expenseData };
      } else {
        return;
      }
    });

    if (existingExpense) {
      existingExpense.value = expense.value;
      const expenseRef = ref(db, `expenses/${uid}/${existingExpense?.id}`);
      await update(expenseRef, existingExpense);
    }
  } catch (e) {
    if (e instanceof FirebaseError) {
      error = e.message;
    }
  }
  return error;
};

export const removeExpense = async (uid: string, expense: Expense) => {
  let error: string | null = null;
  try {
    const expensesRef = ref(db, `expenses/${uid}/${expense.id}`);

    await remove(expensesRef);
  } catch (e) {
    if (e instanceof FirebaseError) {
      error = e.message;
    }
  }
  return error;
};

export const getExpenseById = async (uid: string, expenseId: string) => {
  let error: string | null = null;
  try {
    const expenseRef = ref(db, `expenses/${uid}/${expenseId}`);
    const snapshot = await get(expenseRef);

    if (snapshot.exists()) {
      const expense = snapshot.val();
      return { id: expenseId, ...expense };
    } else {
      throw new Error(`Expense with ID ${expenseId} not found`);
    }
  } catch (e) {
    if (e instanceof FirebaseError) {
      error = e.message;
    }
    return error;
  }
};
