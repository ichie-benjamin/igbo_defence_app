
import { theme, COLORS, FONTS, SIZES } from "./theme";
import apiConstants  from "./apiConstants";
import images from "./images";

import {GlobalStyles} from "./GlobalStyles"

const config = {
    CURRENCY : '₦',
    APP_NAME : "IGBO DEFENCE",
    VERSION : 140,
    MAP_API_KEY : '',
    mapStyle : [
        {
            "featureType":"administrative",
            "elementType":"geometry.fill",
            "stylers":[
                {
                    "color":"#d6e2e6"
                }
            ]
        },
        {
            "featureType":"administrative",
            "elementType":"geometry.stroke",
            "stylers":[
                {
                    "color":"#cfd4d5"
                }
            ]
        },
        {
            "featureType":"administrative",
            "elementType":"labels.text.fill",
            "stylers":[
                {
                    "color":"#242424"
                }
            ]
        },
        {
            "featureType":"administrative.neighborhood",
            "elementType":"labels.text.fill",
            "stylers":[
                {
                    "lightness":25
                }
            ]
        },
        {
            "featureType":"landscape.man_made",
            "elementType":"geometry.fill",
            "stylers":[
                {
                    "color":"#dde2e3"
                }
            ]
        },
        {
            "featureType":"landscape.man_made",
            "elementType":"geometry.stroke",
            "stylers":[
                {
                    "color":"#cfd4d5"
                }
            ]
        },
        {
            "featureType":"landscape.natural",
            "elementType":"geometry.fill",
            "stylers":[
                {
                    "color":"#dde2e3"
                }
            ]
        },
        {
            "featureType":"landscape.natural",
            "elementType":"labels.text.fill",
            "stylers":[
                {
                    "color":"#242424"
                }
            ]
        },
        {
            "featureType":"landscape.natural.terrain",
            "stylers":[
                {
                    "visibility":"off"
                }
            ]
        },
        {
            "featureType":"poi",
            "elementType":"geometry.fill",
            "stylers":[
                {
                    "color":"#dde2e3"
                }
            ]
        },
        {
            "featureType":"poi",
            "elementType":"labels.icon",
            "stylers":[
                {
                    "saturation":-100
                }
            ]
        },
        {
            "featureType":"poi",
            "elementType":"labels.text.fill",
            "stylers":[
                {
                    "color":"#242424"
                }
            ]
        },
        {
            "featureType":"poi.park",
            "elementType":"geometry.fill",
            "stylers":[
                {
                    "color":"#a9de83"
                }
            ]
        },
        {
            "featureType":"poi.park",
            "elementType":"geometry.stroke",
            "stylers":[
                {
                    "color":"#bae6a1"
                }
            ]
        },
        {
            "featureType":"poi.sports_complex",
            "elementType":"geometry.fill",
            "stylers":[
                {
                    "color":"#c6e8b3"
                }
            ]
        },
        {
            "featureType":"poi.sports_complex",
            "elementType":"geometry.stroke",
            "stylers":[
                {
                    "color":"#bae6a1"
                }
            ]
        },
        {
            "featureType":"road",
            "elementType":"labels.icon",
            "stylers":[
                {
                    "saturation":-45
                },
                {
                    "lightness":10
                },
                {
                    "visibility":"on"
                }
            ]
        },
        {
            "featureType":"road",
            "elementType":"labels.text.fill",
            "stylers":[
                {
                    "color":"#242424"
                }
            ]
        },
        {
            "featureType":"road.arterial",
            "elementType":"geometry.fill",
            "stylers":[
                {
                    "color":"#ffffff"
                }
            ]
        },
        {
            "featureType":"road.highway",
            "elementType":"geometry.stroke",
            "stylers":[
                {
                    "color":"#a6b5bb"
                }
            ]
        },
        {
            "featureType":"road.highway",
            "elementType":"labels.icon",
            "stylers":[
                {
                    "visibility":"on"
                }
            ]
        },
        {
            "featureType":"road.highway.controlled_access",
            "elementType":"geometry.fill",
            "stylers":[
                {
                    "color":"#9fb6bd"
                }
            ]
        },
        {
            "featureType":"road.local",
            "elementType":"geometry.fill",
            "stylers":[
                {
                    "color":"#ffffff"
                }
            ]
        },
        {
            "featureType":"transit",
            "elementType":"labels.icon",
            "stylers":[
                {
                    "saturation":-70
                }
            ]
        },
        {
            "featureType":"transit.line",
            "elementType":"geometry.fill",
            "stylers":[
                {
                    "color":"#b4cbd4"
                }
            ]
        },
        {
            "featureType":"transit.line",
            "elementType":"labels.text.fill",
            "stylers":[
                {
                    "color":"#242424"
                }
            ]
        },
        {
            "featureType":"transit.station",
            "elementType":"labels.text.fill",
            "stylers":[
                {
                    "color":"#242424"
                }
            ]
        },
        {
            "featureType":"transit.station.airport",
            "elementType":"geometry.fill",
            "stylers":[
                {
                    "saturation":-100
                },
                {
                    "lightness":-5
                }
            ]
        },
        {
            "featureType":"water",
            "elementType":"geometry.fill",
            "stylers":[
                {
                    "color":"#a6cbe3"
                }
            ]
        }
    ],
}


const walkthrough = [
    {
        id: 0,
        title: "Premium Videos",
        sub_title: "Get to watch all Igbo Defence Premium Videos",
        image : require("../assets/images/onboarding/02.png"),
    },
    {
        id: 1,
        title: "Igbo Defence News",
        sub_title: "Never miss out on Igbo Defence News",
        image : require("../assets/images/onboarding/02.png"),
    },
    {
        id: 2,
        title: "IGB Shorts",
        sub_title: "Create and watch IGB shorts",
        image : require("../assets/images/onboarding/01.png"),
    },
]


export { theme, COLORS, FONTS, images, GlobalStyles, config, walkthrough, apiConstants, SIZES };
