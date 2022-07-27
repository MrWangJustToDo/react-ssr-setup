import { combineReducers } from '@reduxjs/toolkit';

import { client } from './client';
import { server } from './server';

export const reducer = combineReducers({ client, server });
