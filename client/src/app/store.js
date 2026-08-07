import { configureStore } from '@reduxjs/toolkit'
import workspaceReducer from '../features/workspaceSlice.js'
import themeReducer from '../features/themeSlice.js'

export const store = configureStore({
    reducer: {
        workspace: workspaceReducer,
        theme: themeReducer,
    },
})