import {useDispatch} from 'react-redux';
import {setAuthToken, setCurrentUser, setLives, setLogout} from "../store/authSlice";
import {getData, storeData} from "../config";
import {successInit} from "../store/mainScreenReducer";
import {logFunction} from "../helpers/FunctionHelper";
import {removeData} from "../config/asynStorage";
import {setAuthorization} from "../config/axiosInterceptors";
import UserService from "../services/UserService";
import {FeedService} from "../services";

const TAG = "useFeedActions";

export const useFeedActions = () => {
    const dispatch = useDispatch();

    const doIncreaseView = async (id, type) => {
        await FeedService.increaseView({
            'id' : id,
            'type' : type,
        })
    };
    const doToggleVideoLike = async (id, type) => {
        const res = await FeedService.toggleLike({
            'id' : id,
            'type' : type,
        })
        if(res.status){
            return res;
        }else {
            return false;
        }
    };

    return { doIncreaseView, doToggleVideoLike };
};
