
import { atom } from 'recoil';

export const idState = atom({
    key: 'idState',
    default: '',    
});

export const activeComponent = atom({
    key: 'activeComponent',
    default: 'Dashboard', // default value (initial value)
});
