import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BannerSlice = createSlice({
    name: "Banners",
    initialState: {
        data: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setBannerData: (state, action) => {
            state.data = action.payload.data;
            state.isLoading = false;
            state.error = null;
        },
        setBannerLoading: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        setBannerError: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        updateBanner: (state, action) => {
            const updatedBanner = action.payload;
            state.data.map((banner) => banner.bannerId === updatedBanner.bannerId);

        },
        deleteBanner: (state, action) => {
            const bannerIdToDelete = action.payload;
            state.data = state.data.filter((banner) => banner.bannerId !== bannerIdToDelete);
            state.isLoading = false;
            state.error = null;
        },
    },
});

export const { setBannerData, setBannerLoading, setBannerError, updateBanner } = BannerSlice.actions;

export const fetchBannerData = () => async (dispatch) => {
    try {
        dispatch(setBannerLoading());
        const response = await axios.get(import.meta.env.VITE_BASE_URL + "feature/banners");
        dispatch(setBannerData(response.data));
    } catch (error) {
        dispatch(setBannerError(error.message));
    }
};

export const AddBannerData = (form) => async (dispatch) => {
    try {
        console.log("Adding Banner Data...");
        const response = await axios.post(import.meta.env.VITE_BASE_URL + 'feature/insertBanner', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error adding Banner Data:', error);
    }
};

export const updateBannerData = (bannerId, data) => async (dispatch) => {
    try {
        const response = await axios.put(
            import.meta.env.VITE_BASE_URL + `feature/updateBanner/${bannerId}`,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        const updatedBannerData = response.data;

        dispatch(updateBanner(updatedBannerData));

    } catch (error) {
        console.error('Error in updateBannerData:', error);
    }
};

export const deleteBannerData = (bannerId, data) => async (dispatch) => {
    try {

        const response = await axios.delete(
            import.meta.env.VITE_BASE_URL + `feature/deleteBanner/${bannerId}`,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        const deleteBannerData = response.data;

        dispatch(deleteBanner(deleteBannerData));

    } catch (error) {
        console.error('Error:', error);
    }
};



export const selectBannerData = (state) => state.Banner.data;
export const selectBannerLoading = (state) => state.Banner.isLoading;
export const selectBannerError = (state) => state.Banner.error;

export default BannerSlice.reducer;
