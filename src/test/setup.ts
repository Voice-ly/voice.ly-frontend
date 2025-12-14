import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(()=> ({})),
    getApps: vi.fn(()=>[]),
}));

vi.mock('firebase/auth', ()=>({
    getAuth: vi.fn(()=>{
        currentUser: null
    }),
    GoogleAuthProvider: vi.fn(),
    GithubAuthProvider: vi.fn(),
    signInWithPopup: vi.fn(),
    fetchSignInMethodsForEmail: vi.fn(),
    linkWithCredential: vi.fn(),
}));

afterEach(() => {
    cleanup();
});