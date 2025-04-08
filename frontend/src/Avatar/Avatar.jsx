import React, {useState, useEffect, useRef} from 'react';
import { motion } from "framer-motion";

import "./css/style.css";

import { Canvg } from 'canvg';

const Avatar = () => {
    // Refs for SVG elements
    const avatarRef = useRef(null);

    // State for menu and options
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentOption, setCurrentOption] = useState('skincolor');
    const [optionsTitle, setOptionsTitle] = useState('SELECT SKIN COLOR');

    // State for avatar customization
    const [skinColor, setSkinColor] = useState('#edb98a');
    const [hairColor, setHairColor] = useState('#9a4f2b');
    const [fabricColor, setFabricColor] = useState('#545454');
    const [glassOpacity, setGlassOpacity] = useState(0.5);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');

    // State for avatar features
    const [hairStyle, setHairStyle] = useState('h_longhair');
    const [eyeStyle, setEyeStyle] = useState('e_default');
    const [eyebrowStyle, setEyebrowStyle] = useState('eb_default');
    const [mouthStyle, setMouthStyle] = useState('m_default');
    const [clothesStyle, setClothesStyle] = useState('c_hoodie');
    const [facialHairStyle, setFacialHairStyle] = useState('');
    const [glassesStyle, setGlassesStyle] = useState('');
    const [accesoriesStyle, setAccesoriesStyle] = useState('');
    const [tattooStyle, setTattooStyle] = useState('');


    // Arrays for different customization options
    const skinColors = ['#ffdbb4', '#edb98a', '#fd9841', '#fcee93', '#d08b5b', '#ae5d29', '#614335'];
    const hairColors = ['#bb7748', '#404040', '#c79d63', '#e1c68e', '#906253', '#f8afaf', '#f1e6cf', '#d75324', '#59a0ff'];
    const fabricColors = ['#545454', '#65c9ff', '#5199e4', '#25557c', '#e6e6e6', '#929598', '#a7ffc4', '#ffdeb5', '#ffafb9', '#ffffb1', '#ff5c5c', '#e3adff'];
    const backgroundColors = ['#ffffff', '#f5f6eb', '#e5fde2', '#d5effd', '#d1d0fc', '#f7d0fc', '#d0d0d0'];
    const glassOpacities = [0.1, 0.25, 0.5, 0.75, 1.0];


    const hairStyles = [
        'h_longhair', 'h_longhairbob', 'h_hairbun', 'h_longhaircurly', 'h_longhaircurvy',
        'h_longhairdread', 'h_nottoolong', 'h_miawallace', 'h_longhairstraight',
        'h_longhairstraight2', 'h_shorthairdreads', 'h_shorthairdreads2', 'h_shorthairfrizzle',
        'h_shorthairshaggy', 'h_shorthaircurly', 'h_shorthairflat', 'h_shorthairround',
        'h_shorthairwaved', 'h_shorthairsides'
    ];

    const eyeStyles = [
        'e_default', 'e_dizzy', 'e_eyeroll', 'e_happy', 'e_close', 'e_hearts',
        'e_side', 'e_wink', 'e_squint', 'e_surprised', 'e_winkwacky', 'e_cry'
    ];

    const eyebrowStyles = [
        'eb_default', 'eb_default2', 'eb_raised', 'eb_sad', 'eb_sad2',
        'eb_unibrow', 'eb_updown', 'eb_updown2', 'eb_angry', 'eb_angry2'
    ];

    const mouthStyles = [
        'm_default', 'm_twinkle', 'm_tongue', 'm_smile', 'm_serious',
        'm_scream', 'm_sad', 'm_grimace', 'm_eating', 'm_disbelief', 'm_concerned', 'm_vomit'
    ];

    const clothesStyles = ['c_blazer', 'c_sweater', 'c_vneck', 'c_overall', 'c_hoodie'];
    const facialHairStyles = ['', 'f_magnum', 'f_fancy', 'f_magestic', 'f_light'];
    const glassesStyles = ['', 'g_rambo', 'g_fancy', 'g_old', 'g_nerd', 'g_fancy2', 'g_harry'];
    const accesoriesStyles = ['', 'a_earphones', 'a_earring1', 'a_earring2', 'a_earring3'];
    const tattooStyles = ['', 't_harry', 't_airbender', 't_krilin', 't_front', 't_tribal', 't_tribal2', 't_throat'];


    const [option, setOption] = useState(skinColors);

    const [options_div, setOptions_div] = useState((<>
        {option.map((item, index) => (
            <div
                key={index}
                className="skins"
                style={{backgroundColor: item}}
                onClick={() => handleOptionSelect(item)}
            ></div>
        ))}
    </>));


    const setHtmlOption = () => {
        window.setTimeout(() => {
            console.log(currentOption)

        }, 100)

        let optionsContent = null;


        switch (currentOption) {
            case 'skincolor':
                optionsContent = skinColors.map((skin, index) => (
                    <div
                        key={`s_${skin}`}
                        className="skins"
                        id={`s_${skin}`}
                        style={{backgroundColor: skin}}
                        onClick={() => handleOptionSelect(skin)}
                    ></div>
                ));
                break;
            case 'eyes':
                optionsContent = eyeStyles.map((eye, index) => (
                    <div
                        key={`e_${eye}`}
                        className="eyes"
                        id={`e_${eye}`}
                        style={{
                            backgroundColor: skinColor,
                            backgroundPosition: `${index * -53}px 0px`
                        }}
                        onClick={() => handleOptionSelect(eye)}
                    ></div>
                ));
                break;
            case 'eyebrows':
                optionsContent = eyebrowStyles.map((eyebrow, index) => (
                    <div
                        key={`eb_${eyebrow}`}
                        className="eyebrows"
                        id={`eb_${eyebrow}`}
                        style={{
                            backgroundColor: skinColor,
                            backgroundPosition: `${index * -53}px -53px`
                        }}
                        onClick={() => handleOptionSelect(eyebrow)}
                    ></div>
                ));
                break;
            case 'mouths':
                optionsContent = mouthStyles.map((mouth, index) => (
                    <div
                        key={`m_${mouth}`}
                        className="mouths"
                        id={`m_${mouth}`}
                        style={{
                            backgroundColor: skinColor,
                            backgroundPosition: `${index * -53}px -106px`
                        }}
                        onClick={() => handleOptionSelect(mouth)}
                    ></div>
                ));
                break;
            case 'hairstyles':
                optionsContent = hairStyles.map((hairstyle, index) => (
                    <div
                        key={`h_${hairstyle}`}
                        className="hairstyles"
                        id={`h_${hairstyle}`}
                        style={{
                            backgroundColor: '#ffffff',
                            backgroundPosition: `${index * -53}px -159px`
                        }}
                        onClick={() => handleOptionSelect(hairstyle)}
                    ></div>
                ));
                break;
            case 'haircolors':
                optionsContent = hairColors.map((haircolor, index) => (
                    <div
                        key={`hc_${haircolor}`}
                        className="haircolors"
                        id={`hc_${haircolor}`}
                        style={{backgroundColor: haircolor}}
                        onClick={() => handleOptionSelect(haircolor)}
                    ></div>
                ));
                break;
            case 'facialhairs':
                optionsContent = facialHairStyles.map((facialhair, index) => (
                    <div
                        key={`f_${facialhair}`}
                        className="facialhairs"
                        id={`f_${facialhair}`}
                        style={{
                            backgroundColor: '#ffffff',
                            backgroundPosition: `${index * -53}px -212px`
                        }}
                        onClick={() => handleOptionSelect(facialhair)}
                    ></div>
                ));
                break;
            case 'clothes':
                optionsContent = clothesStyles.map((clothe, index) => (
                    <div
                        key={`c_${clothe}`}
                        className="clothes"
                        id={`c_${clothe}`}
                        style={{
                            backgroundColor: '#ffffff',
                            backgroundPosition: `${index * -53}px -265px`
                        }}
                        onClick={() => handleOptionSelect(clothe)}
                    ></div>
                ));
                break;
            case 'fabriccolors':
                optionsContent = fabricColors.map((fabriccolor, index) => (
                    <div
                        key={`f_${fabriccolor}`}
                        className="fabriccolors"
                        id={`f_${fabriccolor}`}
                        style={{backgroundColor: fabriccolor}}
                        onClick={() => handleOptionSelect(fabriccolor)}
                    ></div>
                ));
                break;
            case 'backgroundcolors':
                optionsContent = backgroundColors.map((backgroundcolor, index) => (
                    <div
                        key={`g_${backgroundcolor}`}
                        className="backgroundcolors"
                        id={`g_${backgroundcolor}`}
                        style={{backgroundColor: backgroundcolor}}
                        onClick={() => handleOptionSelect(backgroundcolor)}
                    ></div>
                ));
                break;
            case 'glasses':
                optionsContent = glassesStyles.map((glass, index) => (
                    <div
                        key={`g_${glass}`}
                        className="glasses"
                        id={`g_${glass}`}
                        style={{
                            backgroundColor: '#ffffff',
                            backgroundPosition: `${index * -53}px -313px`
                        }}
                        onClick={() => handleOptionSelect(glass)}
                    ></div>
                ));
                break;
            case 'glassopacity':
                optionsContent = glassOpacities.map((glassopacity, index) => (
                    <div
                        key={`o_${glassopacity}`}
                        className="glassopacity"
                        id={`o_${glassopacity}`}
                        style={{backgroundColor: '#ffffff'}}
                        onClick={() => handleOptionSelect(glassopacity)}
                    >
                        {glassopacity * 100}%
                    </div>
                ));
                break;
            case 'tattoos':
                optionsContent = tattooStyles.map((tattoo, index) => (
                    <div
                        key={`t_${tattoo}`}
                        className="tattoos"
                        id={`t_${tattoo}`}
                        style={{
                            backgroundColor: '#ffffff',
                            backgroundPosition: `${index * -53}px -419px`
                        }}
                        onClick={() => handleOptionSelect(tattoo)}
                    ></div>
                ));
                break;
            case 'accesories':
                optionsContent = accesoriesStyles.map((accesory, index) => (
                    <div
                        key={`a_${accesory}`}
                        className="accesories"
                        id={`a_${accesory}`}
                        style={{
                            backgroundColor: '#ffffff',
                            backgroundPosition: `${index * -53}px -369px`
                        }}
                        onClick={() => handleOptionSelect(accesory)}
                    ></div>
                ));
                break;
            default:
                optionsContent = null;
        }

        setOptions_div(optionsContent);
    }


    // Function to toggle menu
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };


    // Function to handle option selection
    const handleOptionSelect = (option) => {
        console.log(option);
        switch (currentOption) {
            case 'skincolor':
                setOption(skinColors);
                setSkinColor(option);
                break;
            case 'eyes':
                setOption(eyeStyles);
                setEyeStyle(option);
                break;
            case 'eyebrows':
                setOption(eyebrowStyles);
                setEyebrowStyle(option);
                break;
            case 'mouths':
                setOption(mouthStyles);
                setMouthStyle(option);
                break;
            case 'hairstyles':
                setOption(hairStyles);
                setHairStyle(option);
                break;
            case 'haircolors':
                setOption(hairColors);
                setHairColor(option);
                break;
            case 'facialhairs':
                setOption(facialHairStyles);
                setFacialHairStyle(option);
                break;
            case 'clothes':
                setOption(clothesStyles);
                setClothesStyle(option);
                break;
            case 'fabriccolors':
                setOption(fabricColors)
                setFabricColor(option);
                break;
            case 'glasses':
                setOption(glassesStyles);
                setGlassesStyle(option);
                break;
            case 'glassopacity':
                setOption(glassOpacities)
                setGlassOpacity(option);
                break;
            case 'accesories':
                setOption(accesoriesStyles);
                setAccesoriesStyle(option);
                break;
            case 'tattoos':
                setOption(tattooStyles);
                setTattooStyle(option);
                break;
            case 'backgroundcolors':
                setOption(backgroundColors);
                setBackgroundColor(option);
                break;
        }
    };

    // Function to generate random avatar
    const generateRandomAvatar = () => {
        setSkinColor(skinColors[Math.floor(Math.random() * skinColors.length)]);
        setHairColor(hairColors[Math.floor(Math.random() * hairColors.length)]);
        setFabricColor(fabricColors[Math.floor(Math.random() * fabricColors.length)]);
        setBackgroundColor(backgroundColors[Math.floor(Math.random() * backgroundColors.length)]);
        setGlassOpacity(glassOpacities[Math.floor(Math.random() * glassOpacities.length)]);

        setHairStyle(hairStyles[Math.floor(Math.random() * hairStyles.length)]);
        setEyeStyle(eyeStyles[Math.floor(Math.random() * eyeStyles.length)]);
        setEyebrowStyle(eyebrowStyles[Math.floor(Math.random() * eyebrowStyles.length)]);
        setMouthStyle(mouthStyles[Math.floor(Math.random() * mouthStyles.length)]);
        setClothesStyle(clothesStyles[Math.floor(Math.random() * clothesStyles.length)]);
        setFacialHairStyle(facialHairStyles[Math.floor(Math.random() * facialHairStyles.length)]);
        setGlassesStyle(glassesStyles[Math.floor(Math.random() * glassesStyles.length)]);
        setAccesoriesStyle(accesoriesStyles[Math.floor(Math.random() * accesoriesStyles.length)]);
        setTattooStyle(tattooStyles[Math.floor(Math.random() * tattooStyles.length)]);
    };

    // Function to download avatar

// Then update your downloadAvatar function

    const downloadAvatar = async () => {
        // Get the SVG element
        const svgElement = document.getElementById('avatar');
        if (!svgElement) {
            console.error('SVG element not found');
            return;
        }

        // Create a canvas element but don't add it to the DOM
        const canvas = document.createElement('canvas');
        canvas.width = 360;
        canvas.height = 360;
        const ctx = canvas.getContext('2d');

        // Fill the background with the selected background color
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Get the SVG data
        const svgData = new XMLSerializer().serializeToString(svgElement);

        try {
            // Create a Canvg instance with the SVG data
            const v = await Canvg.from(ctx, svgData);

            // Render the SVG to the canvas
            await v.render();

            // Convert canvas to blob and just log it
            canvas.toBlob((blob) => {
                // Create URL for the blob
                const blobUrl = URL.createObjectURL(blob);
                console.log('Avatar image URL:', blobUrl);
            }, 'image/png');
        } catch (error) {
            console.error('Error converting SVG to canvas:', error);
        }
    };

    // Fix the setHtmlOption function to properly update when currentOption changes
    useEffect(() => {

        let optionsContent = null;

        switch (currentOption) {
            case 'skincolor':
                optionsContent = skinColors.map((skin, index) => (
                    <div
                        key={`s_${skin}`}
                        className="skins"
                        id={`s_${skin}`}
                        style={{backgroundColor: skin}}
                        onClick={() => handleOptionSelect(skin)}
                    ></div>
                ));
                break;
            case 'eyes':
                optionsContent = eyeStyles.map((eye, index) => (
                    <div
                        key={`e_${eye}`}
                        className="eyes"
                        id={`e_${eye}`}
                        style={{
                            backgroundColor: skinColor,
                            backgroundPosition: `${index * -53}px 0px`
                        }}
                        onClick={() => handleOptionSelect(eye)}
                    ></div>
                ));
                break;
            case 'eyebrows':
                optionsContent = eyebrowStyles.map((eyebrow, index) => (
                    <div
                        key={`eb_${eyebrow}`}
                        className="eyebrows"
                        id={`eb_${eyebrow}`}
                        style={{
                            backgroundColor: skinColor,
                            backgroundPosition: `${index * -53}px -53px`
                        }}
                        onClick={() => handleOptionSelect(eyebrow)}
                    ></div>
                ));
                break;
            case 'mouths':
                optionsContent = mouthStyles.map((mouth, index) => (
                    <div
                        key={`m_${mouth}`}
                        className="mouths"
                        id={`m_${mouth}`}
                        style={{
                            backgroundColor: skinColor,
                            backgroundPosition: `${index * -53}px -106px`
                        }}
                        onClick={() => handleOptionSelect(mouth)}
                    ></div>
                ));
                break;
            case 'hairstyles':
                optionsContent = hairStyles.map((hairstyle, index) => (
                    <div
                        key={`h_${hairstyle}`}
                        className="hairstyles"
                        id={`h_${hairstyle}`}
                        style={{
                            backgroundColor: '#ffffff',
                            backgroundPosition: `${index * -53}px -159px`
                        }}
                        onClick={() => handleOptionSelect(hairstyle)}
                    ></div>
                ));
                break;
            case 'haircolors':
                optionsContent = hairColors.map((haircolor, index) => (
                    <div
                        key={`hc_${haircolor}`}
                        className="haircolors"
                        id={`hc_${haircolor}`}
                        style={{backgroundColor: haircolor}}
                        onClick={() => handleOptionSelect(haircolor)}
                    ></div>
                ));
                break;
            case 'facialhairs':
                optionsContent = facialHairStyles.map((facialhair, index) => (
                    <div
                        key={`f_${facialhair}`}
                        className="facialhairs"
                        id={`f_${facialhair}`}
                        style={{
                            backgroundColor: '#ffffff',
                            backgroundPosition: `${index * -53}px -212px`
                        }}
                        onClick={() => handleOptionSelect(facialhair)}
                    ></div>
                ));
                break;
            case 'clothes':
                optionsContent = clothesStyles.map((clothe, index) => (
                    <div
                        key={`c_${clothe}`}
                        className="clothes"
                        id={`c_${clothe}`}
                        style={{
                            backgroundColor: '#ffffff',
                            backgroundPosition: `${index * -53}px -265px`
                        }}
                        onClick={() => handleOptionSelect(clothe)}
                    ></div>
                ));
                break;
            case 'fabriccolors':
                optionsContent = fabricColors.map((fabriccolor, index) => (
                    <div
                        key={`f_${fabriccolor}`}
                        className="fabriccolors"
                        id={`f_${fabriccolor}`}
                        style={{backgroundColor: fabriccolor}}
                        onClick={() => handleOptionSelect(fabriccolor)}
                    ></div>
                ));
                break;
            case 'backgroundcolors':
                optionsContent = backgroundColors.map((backgroundcolor, index) => (
                    <div
                        key={`g_${backgroundcolor}`}
                        className="backgroundcolors"
                        id={`g_${backgroundcolor}`}
                        style={{backgroundColor: backgroundcolor}}
                        onClick={() => handleOptionSelect(backgroundcolor)}
                    ></div>
                ));
                break;
            case 'glasses':
                optionsContent = glassesStyles.map((glass, index) => (
                    <div
                        key={`g_${glass}`}
                        className="glasses"
                        id={`g_${glass}`}
                        style={{
                            backgroundColor: '#ffffff',
                            backgroundPosition: `${index * -53}px -313px`
                        }}
                        onClick={() => handleOptionSelect(glass)}
                    ></div>
                ));
                break;
            case 'glassopacity':
                optionsContent = glassOpacities.map((glassopacity, index) => (
                    <div
                        key={`o_${glassopacity}`}
                        className="glassopacity"
                        id={`o_${glassopacity}`}
                        style={{backgroundColor: '#ffffff'}}
                        onClick={() => handleOptionSelect(glassopacity)}
                    >
                        {glassopacity * 100}%
                    </div>
                ));
                break;
            case 'tattoos':
                optionsContent = tattooStyles.map((tattoo, index) => (
                    <div
                        key={`t_${tattoo}`}
                        className="tattoos"
                        id={`t_${tattoo}`}
                        style={{
                            backgroundColor: '#ffffff',
                            backgroundPosition: `${index * -53}px -419px`
                        }}
                        onClick={() => handleOptionSelect(tattoo)}
                    ></div>
                ));
                break;
            case 'accesories':
                optionsContent = accesoriesStyles.map((accesory, index) => (
                    <div
                        key={`a_${accesory}`}
                        className="accesories"
                        id={`a_${accesory}`}
                        style={{
                            backgroundColor: '#ffffff',
                            backgroundPosition: `${index * -53}px -369px`
                        }}
                        onClick={() => handleOptionSelect(accesory)}
                    ></div>
                ));
                break;
            default:
                optionsContent = null;
        }

        setOptions_div(optionsContent);
    }, [currentOption, skinColor]); // Add dependencies that affect the options display

// Function to handle menu option selection
    const handleMenuSelect = (option) => {
        setCurrentOption(option);
        switch (option) {
            case 'skincolor':
                setOptionsTitle('SELECT SKIN COLOR');
                setOption(skinColors);
                break;
            case 'eyes':
                setOptionsTitle('SELECT EYES');
                setOption(eyeStyles);
                break;
            case 'eyebrows':
                setOptionsTitle('SELECT EYEBROWS');
                setOption(eyebrowStyles);
                break;
            case 'mouths':
                setOptionsTitle('SELECT MOUTH');
                setOption(mouthStyles);
                break;
            case 'hairstyles':
                setOptionsTitle('SELECT HAIR STYLE');
                setOption(hairStyles);
                break;
            case 'haircolors':
                setOptionsTitle('SELECT HAIR COLOR');
                setOption(hairColors);
                break;
            case 'facialhairs':
                setOptionsTitle('SELECT FACIAL HAIR');
                setOption(facialHairStyles);
                break;
            case 'clothes':
                setOptionsTitle('SELECT CLOTHES');
                setOption(clothesStyles);
                break;
            case 'fabriccolors':
                setOptionsTitle('SELECT FABRIC COLOR');
                setOption(fabricColors);
                break;
            case 'glasses':
                setOptionsTitle('SELECT GLASSES');
                setOption(glassesStyles);
                break;
            case 'glassopacity':
                setOptionsTitle('SELECT GLASS OPACITY');
                setOption(glassOpacities);
                break;
            case 'accesories':
                setOptionsTitle('SELECT ACCESORIES');
                setOption(accesoriesStyles);
                break;
            case 'tattoos':
                setOptionsTitle('SELECT TATTOOS');
                setOption(tattooStyles);
                break;
            case 'backgroundcolors':
                setOptionsTitle('SELECT BACKGROUND COLOR');
                setOption(backgroundColors);
                break;
            case 'download':
                downloadAvatar();
                break;
            default:
                setOptionsTitle('SELECT OPTION');
                break;
        }

        setMenuOpen(false);
    };

    useEffect(() => {
        generateRandomAvatar()
    }, []);

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto">
            <div className="relative w-full bg-white rounded-lg shadow-lg">
                {/* Avatar SVG */}
                <div id="avatar" className="relative w-full" style={{maxWidth: '360px', margin: '0 auto'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="360px"
                         height="360px" viewBox="0 0 360 360">
                        <svg id="hair_back" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                             width="360px" height="360px" viewBox="0 0 360 360">
                            <polygon id="background" fill={backgroundColor} points="0,0 360,0 360,360 0,360 "/>
                            <g className={hairStyle} style={{display: hairStyle === 'h_longhair' ? '' : 'none'}}>
                                <path className="tinted" fill={hairColor}
                                      d="M71 174c3,-11 -13,-62 3,-94 17,-35 36,-48 83,-51 34,-3 68,-2 99,16 13,7 21,22 28,35 5,11 8,24 9,36 0,13 -6,24 -6,43 -1,32 39,33 39,62 0,40 -29,40 -28,56 1,20 28,25 28,55 0,11 -10,22 -18,28 -87,0 -174,0 -260,0 -14,-11 -15,-23 -14,-36 3,-18 25,-31 25,-49 0,-11 -25,-20 -25,-54 1,-29 37,-41 37,-47zm126 -85l-1 0c0,0 0,0 0,0l1 0z"/>
                            </g>
                            <g className="h_longhairbob" style={{display: hairStyle === 'h_longhairbob' ? '' : 'none'}}>
                                <path className="tinted" fill={hairColor}
                                      d="M114 60c20,-23 60,-22 65,-22 5,0 45,-1 65,22 20,22 38,69 45,102 8,33 4,64 -6,84 -9,19 -17,20 -32,17 -16,-3 -22,-11 -72,-10 -50,-1 -56,7 -72,10 -15,3 -23,2 -32,-17 -10,-20 -14,-51 -6,-84 7,-33 25,-80 45,-102z"/>
                            </g>
                            <g className="h_longhaircurly"
                               style={{display: hairStyle === 'h_longhaircurly' ? '' : 'none'}}>
                                <path className="tinted" fill={hairColor}
                                      d="M180 269c-23,0 -44,-7 -56,-18 -4,1 -8,1 -12,1 -38,0 -68,-27 -68,-60 0,-18 8,-34 22,-45 -12,-10 -15,-31 -7,-52 9,-20 27,-34 42,-33 2,-13 13,-25 29,-32 19,-8 38,-6 50,3 12,-9 31,-11 50,-3 16,7 27,19 29,32 15,-1 33,13 42,33 8,21 5,42 -7,52 14,11 22,27 22,45 0,33 -30,60 -68,60 -4,0 -8,0 -12,-1 -12,11 -33,18 -56,18zm-69 -137c0,0 0,0 0,0l0 -1 0 1zm138 -1l0 1c0,0 0,0 0,0l0 -1z"/>
                            </g>
                            <g className="h_longhaircurvy"
                               style={{display: hairStyle === 'h_longhaircurvy' ? '' : 'none'}}>
                                <path className="tinted" fill={hairColor}
                                      d="M183 34c50,0 67,23 80,68 4,14 13,31 20,43 5,12 0,17 0,25 8,2 23,10 30,27 4,10 -4,31 -15,38 -3,3 0,24 -6,37 -7,14 -13,13 -23,19 -7,4 23,38 4,63 -12,-22 -36,0 -51,-10 -18,-10 -18,-27 -18,-38 0,-8 5,-27 14,-44l-93 0c-6,12 -22,21 -22,28 0,6 0,19 23,21 -6,7 -23,3 -27,1 0,5 1,5 4,10 -10,-3 -15,-11 -16,-15 -6,7 -2,14 -5,24 -22,-10 -25,-31 -26,-36 -2,-33 11,-36 9,-45 -4,-17 -19,-20 -19,-37 0,-19 23,-41 28,-47 5,-6 -1,-20 0,-30 3,-18 18,-35 19,-35 31,-44 27,-67 90,-67z"/>
                            </g>
                            <g className="h_longhairdread"
                               style={{display: hairStyle === 'h_longhairdread' ? '' : 'none'}}>
                                <path className="tinted" fill={hairColor}
                                      d="M233 262l-91 0c1,3 1,6 2,10 1,7 0,14 -1,21 0,8 -1,16 1,22 1,6 5,11 10,16 2,3 5,6 7,9 2,4 1,8 -2,10 -3,2 -7,1 -10,-2 -1,-3 -4,-5 -6,-8 -4,-4 -7,-9 -10,-14 0,7 2,13 5,19 1,4 0,8 -4,9 -4,2 -8,0 -9,-3 -4,-9 -6,-19 -6,-29 -4,8 -7,16 -9,27 -1,4 -4,6 -8,6 -4,-1 -6,-5 -6,-8 1,-2 1,-4 1,-6 -2,6 -5,11 -11,17 -3,3 -8,3 -10,0 -3,-3 -3,-7 0,-10 9,-9 11,-19 10,-29 -1,8 -4,15 -10,22 -2,3 -6,3 -9,1 -3,-3 -4,-7 -2,-10 6,-7 9,-16 9,-26 0,-4 -1,-7 -1,-11 -3,6 -7,12 -12,18 -2,3 -6,3 -9,1 -3,-3 -4,-7 -1,-10 10,-14 14,-25 13,-35 0,0 0,0 0,0 0,0 0,0 0,-1 -1,-6 -4,-11 -7,-16 -2,1 -3,3 -4,4 -2,2 -4,5 -5,6 0,0 1,2 2,3 1,2 2,3 3,5 1,4 -1,8 -5,9 -3,2 -7,0 -9,-4 0,-1 0,-2 -1,-3 -2,-4 -5,-8 -3,-14 2,-4 4,-8 7,-11 2,-2 4,-5 5,-7 1,-5 0,-11 0,-17 -1,-7 -2,-15 0,-23 2,-7 6,-14 10,-21 2,-3 3,-5 5,-7 1,-4 1,-14 0,-24 0,-8 0,-15 1,-19 2,-5 10,-20 17,-33 7,-12 14,-23 16,-24 1,-1 2,-2 4,-2 3,-3 9,-6 12,-9 0,-1 -1,-2 -1,-3 0,-5 0,-10 5,-14 5,-3 9,-3 14,-2 2,0 3,1 4,0 0,0 0,-1 1,-2 2,-4 4,-8 10,-10l0 0c6,0 10,2 14,4 2,1 4,2 5,2 4,0 7,-1 10,-2 5,-1 10,-3 17,-2l0 0c6,1 8,5 11,8 1,2 3,3 3,4 1,0 4,-1 6,-2 6,-2 11,-4 17,-2 7,3 11,8 14,14 2,2 3,4 5,6 4,5 10,9 16,13 3,2 5,4 8,6 0,1 2,2 3,3 6,4 11,8 14,16 3,10 4,22 5,33 0,4 1,8 1,11 1,7 2,12 3,17 2,5 4,9 7,15 1,3 4,7 6,10 2,3 4,5 6,6 4,3 4,7 2,10 -2,3 -7,4 -10,2 0,0 0,-1 0,-1 0,9 6,19 11,29 5,9 11,19 13,29 1,3 -1,7 -5,8 -1,0 -2,0 -2,0 1,5 2,11 3,16 1,4 -2,8 -5,8 -2,1 -4,0 -6,-1 1,4 1,7 2,11 1,5 2,12 4,17 1,4 -2,8 -5,9 -4,1 -8,-2 -9,-5 -2,-8 -3,-13 -4,-19 -2,-9 -3,-18 -7,-27 1,3 2,6 2,10 2,6 3,12 4,18 1,3 -1,7 -5,8 -3,1 -6,-1 -8,-3l1 3c2,8 4,15 5,22 1,4 -2,8 -6,9 -3,0 -7,-2 -8,-6 -1,-7 -3,-14 -4,-22 -2,-7 -4,-14 -5,-21 -2,12 -3,24 0,39 0,3 -2,7 -6,8 -4,1 -7,-2 -8,-6 -2,-11 -2,-20 -2,-29 -2,10 -3,22 -2,34 1,4 -2,7 -6,8 -4,0 -7,-3 -8,-7 -1,-10 -1,-21 1,-30 -3,3 -4,6 -5,10 -3,7 -2,16 1,26 1,3 -2,7 -5,8 -4,1 -8,-1 -9,-5 -3,-12 -4,-23 -1,-33 1,-1 1,-2 1,-3 -4,8 -7,17 -9,28 0,4 -4,6 -8,6 -3,-1 -6,-5 -5,-8 2,-12 5,-22 9,-30 -2,2 -3,3 -5,5 -2,3 -7,3 -10,1 -3,-3 -3,-7 -1,-10 2,-1 4,-5 8,-9 8,-10 21,-24 29,-35z"/>
                            </g>
                            <g className="h_nottoolong" style={{display: hairStyle === 'h_nottoolong' ? '' : 'none'}}>
                                <path className="tinted" fill={hairColor}
                                      d="M272 146l0 -3 0 0 0 -15c0,-51 -42,-93 -93,-93l0 0c-44,0 -82,32 -90,75 0,0 -1,0 -1,0 -7,0 -13,7 -13,16 0,7 4,15 12,16l0 100c0,4 3,8 8,8l68 0 13 0 58 0c21,0 38,-17 38,-38l0 -66z"/>
                            </g>
                            <g className="h_miawallace" style={{display: hairStyle === 'h_miawallace' ? '' : 'none'}}>
                                <path className="tinted" fill={hairColor}
                                      d="M92 256c25,-4 58,-9 87,-9 29,0 61,5 86,9 45,-50 26,-79 8,-134 -21,-60 -30,-83 -94,-83 -64,0 -74,23 -94,83 -19,55 -37,84 7,134z"/>
                            </g>
                            <g className="h_longhairstraight"
                               style={{display: hairStyle === 'h_longhairstraight' ? '' : 'none'}}>
                                <path className="tinted" fill={hairColor}
                                      d="M116 318l157 0 0 -178 0 -11c0,-51 -42,-92 -93,-92l0 0c-50,0 -92,41 -92,92 0,74 0,148 0,222 16,-2 28,-16 28,-33z"/>
                            </g>
                            <g className="h_longhairstraight2"
                               style={{display: hairStyle === 'h_longhairstraight2' ? '' : 'none'}}>
                                <path className="tinted" fill={hairColor}
                                      d="M63 342c45,9 73,1 83,-51l85 0c29,23 59,46 73,53 7,-3 13,-21 6,-44 -12,-41 -45,-78 -48,-120 -3,-38 3,-86 -2,-102 -6,-19 -26,-39 -53,-33 -5,-8 -22,-18 -47,-13 -31,7 -68,38 -69,80 -2,99 -1,215 -28,230z"/>
                            </g>
                            <g className="h_shorthairshaggy"
                               style={{display: hairStyle === 'h_shorthairshaggy' ? '' : 'none'}}>
                                <path className="tinted" fill={hairColor}
                                      d="M120 190c36,2 72,4 108,6 -1,24 1,38 22,36 -7,5 -14,7 -22,6 3,4 10,5 18,5 -18,17 -30,10 -40,-6 -18,2 -36,5 -54,8 -15,13 -37,14 -70,-9 14,3 27,-13 38,-46z"/>
                            </g>
                        </svg>
                        <svg id="skincolor" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                             width="360px" height="360px" viewBox="0 0 360 360">
                            <g id="skin">
                                <path id="body" fill={skinColor}
                                      d="M304 360l0 -15c0,-47 -39,-85 -86,-85l-8 0 0 -22c22,-10 37,-32 39,-57 7,-1 13,-7 13,-15l0 -15c0,-8 -6,-14 -13,-15l0 -8c0,-38 -31,-69 -69,-69l0 0c-38,0 -69,31 -69,69l0 8c-7,1 -13,7 -13,15l0 15c0,8 6,14 13,15 2,25 17,47 39,57l0 22 -8 0c-47,0 -86,38 -86,85l0 15 248 0z"/>
                                <path id="neck" fill="#000000" fillOpacity="0.2"
                                      d="M180 256c-11,0 -21,-2 -30,-6l0 -12c9,5 19,7 30,7l0 0c11,0 21,-2 30,-7l0 12c-9,4 -19,6 -30,6z"/>
                                <path id="nose" fill="#000000" fillOpacity="0.2"
                                      d="M180 181c9,0 16,-4 16,-9l-32 0c0,5 7,9 16,9z"/>
                            </g>
                        </svg>
                        <svg id="tattoos" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                             width="360px" height="360px" viewBox="0 0 360 360">
                            <g id="t_harry" style={{display: tattooStyle === 't_harry' ? '' : 'none'}}>
                                <polygon fill="#000000" fillOpacity="0.7"
                                         points="177,84 193,120 177,117 179,139 167,110 185,113 "/>
                            </g>
                            <g id="t_airbender" style={{display: tattooStyle === 't_airbender' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M194 61c-4,-1 -9,-2 -14,-2l0 0c-5,0 -10,1 -14,2l0 36 -17 0 31 30 31 -30 -17 0 0 -36z"/>
                            </g>
                            <g id="t_krilin" style={{display: tattooStyle === 't_krilin' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M191 71c3,0 6,3 6,7 0,3 -3,6 -6,6 -4,0 -6,-3 -6,-6 0,-4 2,-7 6,-7zm0 32c3,0 6,3 6,7 0,3 -3,6 -6,6 -4,0 -6,-3 -6,-6 0,-4 2,-7 6,-7zm-22 0c4,0 6,3 6,7 0,3 -2,6 -6,6 -3,0 -6,-3 -6,-6 0,-4 3,-7 6,-7zm22 -16c3,0 6,3 6,7 0,3 -3,6 -6,6 -4,0 -6,-3 -6,-6 0,-4 2,-7 6,-7zm-22 0c4,0 6,3 6,7 0,3 -2,6 -6,6 -3,0 -6,-3 -6,-6 0,-4 3,-7 6,-7zm0 -16c4,0 6,3 6,7 0,3 -2,6 -6,6 -3,0 -6,-3 -6,-6 0,-4 3,-7 6,-7z"/>
                            </g>
                            <g id="t_front" style={{display: tattooStyle === 't_front' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M150 253l0 3 0 0c2,-3 4,-4 4,-5 -1,0 -3,1 -4,2zm49 27c0,0 1,1 3,1 1,0 2,0 4,0 0,0 0,0 0,0 4,0 10,-1 14,-6 0,0 -1,1 -1,1 0,1 0,1 0,2 0,1 0,1 -1,2 0,1 -1,3 -2,4 -1,2 -2,3 -3,4 0,0 0,0 1,-1 0,-1 0,-1 0,-2 0,0 0,0 0,0 0,-1 0,-1 -1,-2 -1,0 -1,0 -1,0 0,0 -1,0 -1,0 -1,0 -2,0 -3,1 -1,1 -2,2 -2,3 0,0 0,0 0,1 0,0 0,0 0,0 1,0 1,0 1,0 0,0 0,0 0,0 0,0 1,0 1,0 0,0 0,-1 1,-1 0,0 0,-1 0,-1 0,0 0,1 0,1 0,0 0,1 0,1 0,1 -1,2 -1,2 -1,1 -1,3 -2,4 -2,1 -3,3 -5,4 0,-1 0,-2 1,-3 0,-2 1,-4 1,-6 0,0 0,0 0,0 0,-3 -1,-6 -4,-9zm19 5c2,-3 3,-6 3,-10 0,-1 0,-2 0,-3 0,-1 -1,-2 -1,-3 0,0 0,0 0,0 1,0 1,0 1,0 0,0 0,0 0,0 2,0 6,0 9,3 0,0 0,-1 0,-1 0,0 0,0 0,0 -1,0 -3,1 -4,3 0,1 0,1 0,1l0 0c0,1 0,1 1,2 0,0 0,0 0,0 0,0 0,0 1,0 0,0 1,0 2,-1 0,0 1,0 1,-1 0,-1 1,-1 1,-2 0,-1 0,-2 0,-3l0 0c0,-3 -1,-6 -5,-8 0,0 1,0 1,0 2,0 6,0 9,2 2,1 3,2 4,4 1,1 2,4 2,6 0,1 0,1 0,1 0,-1 -1,-2 -2,-3 0,-1 -2,-2 -3,-2 0,0 -1,0 -1,0 0,0 0,0 -1,1 -1,0 -2,1 -2,3 0,0 0,0 0,0 0,2 1,4 1,7 0,0 0,0 0,0 0,0 0,1 0,2 0,1 -1,2 -1,3 0,0 0,-1 0,-1 0,0 0,-1 0,-1 0,-1 0,-1 0,-2 0,0 0,0 -1,-1 0,0 0,-1 0,-1 -1,0 -1,0 -1,0 -1,0 -1,0 -1,0 -1,0 -2,0 -2,2 -1,1 -1,2 -1,4 0,1 0,1 0,2 0,0 0,-1 0,-1 -1,-1 -1,-2 -2,-3 -1,0 -2,-1 -3,-1 0,0 0,0 -1,0 0,0 -1,1 -1,2 -1,1 -1,2 -1,3 0,2 0,4 1,5 0,2 1,4 2,5 0,0 0,0 -1,0 0,-1 0,-1 -1,-1 0,-1 -1,-1 -1,-1 -1,-1 -2,-2 -3,-3 -1,-2 -2,-3 -2,-4 0,-1 1,-2 3,-4zm-30 -18c0,0 0,1 0,1 0,1 0,1 0,2 0,1 0,2 0,3 1,1 1,2 2,3 0,0 1,0 1,0 0,0 0,0 1,0 1,0 3,-1 5,-2 1,-2 3,-3 5,-4 3,-2 12,-4 18,-4 1,0 2,0 3,0 1,0 2,0 3,0 -1,0 -4,1 -7,2 -3,1 -6,3 -8,6 0,0 0,-1 0,-1 0,0 0,0 0,0 0,-1 0,-3 -2,-3 0,0 0,0 0,0 -1,0 -2,0 -2,1 -1,1 -1,1 -1,2l0 0c0,1 0,2 2,3 0,0 1,0 1,0 1,0 1,0 2,0 1,0 3,0 4,-1 2,0 3,-1 4,-1 -1,0 -1,0 -1,0 0,1 -1,1 -1,1 0,1 -1,1 -1,2 -1,0 -3,1 -5,2 -1,0 -3,1 -6,1 -1,0 -2,0 -3,-1 -1,0 -2,0 -3,0 0,0 0,0 1,0 0,0 0,0 1,-1 0,0 1,0 1,-1 1,0 1,-1 1,-1 0,-1 0,-1 0,-1 0,-1 0,-1 -1,-1 0,0 -1,0 -1,0 -1,0 -1,0 -2,0 0,0 -1,0 -1,1 -1,0 -1,2 -1,3 0,0 0,0 0,0 0,1 0,3 0,4 1,1 1,3 2,5 0,0 0,0 0,0 -1,-1 -1,-1 -2,-1 0,0 -1,0 -2,-1 0,0 -1,0 -2,-1 -1,-1 -3,-2 -4,-4 -1,-2 -2,-4 -2,-7 0,-1 0,-2 0,-3 0,-1 1,-2 1,-3zm23 -7l-1 0 0 -1c-1,-1 -1,-2 -2,-3 0,0 -1,-1 -1,-2 -1,0 -1,-1 -2,-1 0,0 0,0 0,-1 0,0 0,0 0,0 0,0 0,1 0,1 0,2 -1,4 -2,5 -1,2 -3,3 -5,3 0,0 0,0 0,0 -2,0 -3,0 -3,-1 -1,-1 -2,-2 -2,-3l0 0c0,-1 1,-2 2,-2 0,0 0,0 0,0 1,0 2,1 2,1 1,0 1,1 1,1 0,-2 -2,-3 -3,-5 -1,-1 -3,-2 -4,-3 -1,-1 -1,-1 -2,-2 -1,0 -1,-1 -2,-1 0,0 0,0 0,0 -1,0 -1,-1 -1,-1 5,6 7,12 7,18 0,3 -1,5 -1,7 0,2 -1,4 -1,4 1,-1 2,-2 3,-3 0,-1 1,-2 1,-2 0,-1 0,-1 1,-1 0,-1 0,-1 0,-1 0,0 0,-1 0,-1 0,0 0,0 0,0 -1,0 -1,0 -1,0 0,0 0,-1 0,-1l0 0c0,0 0,0 0,0 0,-1 0,-1 0,-1 1,0 1,0 1,0 0,0 1,0 1,0 1,1 1,1 1,1 1,0 1,1 1,1 0,0 0,0 0,0 0,1 0,1 -1,2 0,0 0,1 0,1 -1,1 -1,1 -1,1 0,1 0,1 0,1 0,0 -1,0 -1,0 0,0 1,0 1,0 0,0 1,-1 2,-1 0,-1 1,-1 2,-2 1,0 2,-1 2,-1 1,-1 1,-1 1,-1 0,0 0,0 1,-1 0,0 0,-1 0,-2 0,0 0,-1 1,-1 0,-1 1,-1 2,-1 0,0 0,0 0,0 1,0 2,0 3,1 1,0 1,1 2,2 -1,-2 -2,-3 -2,-4l0 0zm-2 6c-1,0 -1,0 -1,0 0,0 0,0 0,0 -1,0 -1,0 -1,0 0,0 0,0 -1,0 0,-1 0,-1 0,-1 0,0 0,-1 0,-1 0,0 1,0 1,-1 0,-1 1,-1 2,-1 0,0 0,0 0,0 0,0 0,0 0,0 0,0 1,0 1,1 0,0 0,0 0,0 0,1 0,1 0,1 0,0 0,1 0,1 -1,0 -1,1 -1,1zm34 -3c-1,0 -2,0 -3,-1 1,1 2,2 3,3l0 0c0,0 0,0 0,0 0,-1 0,-1 0,-2zm-19 -3c-2,0 -4,0 -6,0l-6 0c1,1 2,3 2,4 1,0 1,0 2,0 1,0 2,0 4,0 1,0 1,0 2,0 1,0 2,0 2,0 0,0 0,0 0,0 0,0 -1,0 -1,-1 0,0 -1,-1 -1,-1 0,0 0,-1 1,-1 0,-1 0,-1 1,-1zm-14 -4l0 -3c-1,-1 -3,-2 -4,-2 0,1 2,2 4,5l0 0zm-49 24c0,0 -1,1 -3,1 -1,0 -2,0 -4,0 0,0 0,0 0,0 -4,0 -10,-1 -14,-6 0,0 1,1 1,1 0,1 0,1 0,2 0,1 0,1 1,2 0,1 1,3 2,4 1,2 2,3 3,4 0,0 0,0 -1,-1 0,-1 0,-1 0,-2 0,0 0,0 0,0 0,-1 0,-1 1,-2 1,0 1,0 1,0 0,0 1,0 1,0 1,0 2,0 3,1 1,1 2,2 2,3 0,0 0,0 0,1 0,0 0,0 0,0 -1,0 -1,0 -1,0 0,0 0,0 0,0 0,0 -1,0 -1,0 0,0 0,-1 -1,-1 0,0 0,-1 0,-1 0,0 0,1 0,1 0,0 0,1 0,1 0,1 1,2 1,2 1,1 1,3 2,4 2,1 3,3 5,4 0,-1 0,-2 -1,-3 0,-2 -1,-4 -1,-6 0,0 0,0 0,0 0,-3 1,-6 4,-9zm-19 5c-2,-3 -3,-6 -3,-10 0,-1 0,-2 0,-3 0,-1 1,-2 1,-3 0,0 0,0 0,0 -1,0 -1,0 -1,0 0,0 0,0 0,0 -2,0 -6,0 -9,3 0,0 0,-1 0,-1 0,0 0,0 0,0 1,0 3,1 4,3 0,1 0,1 0,1l0 0c0,1 0,1 -1,2 0,0 0,0 0,0 0,0 0,0 -1,0 0,0 -1,0 -2,-1 0,0 -1,0 -1,-1 0,-1 -1,-1 -1,-2 0,-1 0,-2 0,-3l0 0c0,-3 1,-6 5,-8 0,0 -1,0 -1,0 -2,0 -6,0 -9,2 -2,1 -3,2 -4,4 -1,1 -2,4 -2,6 0,1 0,1 0,1 0,-1 1,-2 2,-3 0,-1 2,-2 3,-2 0,0 1,0 1,0 0,0 0,0 1,1 1,0 2,1 2,3 0,0 0,0 0,0 0,2 -1,4 -1,7 0,0 0,0 0,0 0,0 0,1 0,2 0,1 1,2 1,3 0,0 0,-1 0,-1 0,0 0,-1 0,-1 0,-1 0,-1 0,-2 0,0 0,0 1,-1 0,0 0,-1 0,-1 1,0 1,0 1,0 1,0 1,0 1,0 1,0 2,0 2,2 1,1 1,2 1,4 0,1 0,1 0,2 0,0 0,-1 0,-1 1,-1 1,-2 2,-3 1,0 2,-1 3,-1 0,0 0,0 1,0 0,0 1,1 1,2 1,1 1,2 1,3 0,2 0,4 -1,5 0,2 -1,4 -2,5 0,0 0,0 1,0 0,-1 0,-1 1,-1 0,-1 1,-1 1,-1 1,-1 2,-2 3,-3 1,-2 2,-3 2,-4 0,-1 -1,-2 -3,-4zm30 -18c0,0 0,1 0,1 0,1 0,1 0,2 0,1 0,2 0,3 -1,1 -1,2 -2,3 0,0 -1,0 -1,0 0,0 0,0 -1,0 -1,0 -3,-1 -5,-2 -1,-2 -3,-3 -5,-4 -3,-2 -12,-4 -18,-4 -1,0 -2,0 -3,0 -1,0 -2,0 -3,0 1,0 4,1 7,2 3,1 6,3 8,6 0,0 0,-1 0,-1 0,0 0,0 0,0 0,-1 0,-3 2,-3 0,0 0,0 0,0 1,0 2,0 2,1 1,1 1,1 1,2l0 0c0,1 0,2 -2,3 0,0 -1,0 -1,0 -1,0 -1,0 -2,0 -1,0 -3,0 -4,-1 -2,0 -3,-1 -4,-1 1,0 1,0 1,0 0,1 1,1 1,1 0,1 1,1 1,2 1,0 3,1 5,2 1,0 3,1 6,1 1,0 2,0 3,-1 1,0 2,0 3,0 0,0 0,0 -1,0 0,0 0,0 -1,-1 0,0 -1,0 -1,-1 -1,0 -1,-1 -1,-1 0,-1 0,-1 0,-1 0,-1 0,-1 1,-1 0,0 1,0 1,0 1,0 1,0 2,0 0,0 1,0 1,1 1,0 1,2 1,3 0,0 0,0 0,0 0,1 0,3 0,4 -1,1 -1,3 -2,5 0,0 0,0 0,0 1,-1 1,-1 2,-1 0,0 1,0 2,-1 0,0 1,0 2,-1 1,-1 3,-2 4,-4 1,-2 2,-4 2,-7 0,-1 0,-2 0,-3 0,-1 -1,-2 -1,-3zm-22 -8l0 1 -1 0 0 0c0,1 -1,2 -2,4 1,-1 1,-2 2,-2 1,-1 2,-1 3,-1 0,0 0,0 0,0 1,0 2,0 2,1 1,0 1,1 1,1 0,1 0,2 0,2 1,1 1,1 1,1 0,0 0,0 1,1 0,0 1,1 2,1 1,1 2,1 2,2 1,0 2,1 2,1 0,0 1,0 1,0 0,0 -1,0 -1,0 0,0 0,0 0,-1 0,0 0,0 -1,-1 0,0 0,-1 0,-1 -1,-1 -1,-1 -1,-2 0,0 0,0 0,0 0,0 0,-1 1,-1 0,0 0,0 1,-1 0,0 1,0 1,0 0,0 0,0 1,0 0,0 0,0 0,1 0,0 0,0 0,0l0 0c0,0 0,1 0,1 0,0 0,0 -1,0 0,0 0,0 0,0 0,0 0,1 0,1 0,0 0,0 0,1 1,0 1,0 1,1 0,0 1,1 1,2 1,1 2,2 3,3 0,0 -1,-2 -1,-4 0,-2 -1,-4 -1,-7 0,-6 2,-12 7,-18 0,0 0,1 -1,1 0,0 0,0 0,0 -1,0 -1,1 -2,1 -1,1 -1,1 -2,2 -1,1 -3,2 -4,3 -1,2 -3,3 -3,5 0,0 0,-1 1,-1 0,0 1,-1 2,-1 0,0 0,0 0,0 1,0 2,1 2,2l0 0c0,1 -1,2 -2,3 0,1 -1,1 -3,1 0,0 0,0 0,0 -2,0 -4,-1 -5,-3 -1,-1 -2,-3 -2,-5 0,0 0,-1 0,-1 0,0 0,0 0,0 0,1 0,1 0,1 -1,0 -1,1 -2,1 0,1 -1,2 -1,2 -1,1 -1,2 -2,3zm1 7c1,0 1,0 1,0l0 0c1,0 1,0 1,0 0,0 0,0 1,0 0,-1 0,-1 0,-1 0,0 0,-1 0,-1 0,0 -1,0 -1,-1 0,-1 -1,-1 -2,-1 0,0 0,0 0,0 0,0 0,0 0,0 0,0 -1,0 -1,1 0,0 0,0 0,0 0,1 0,1 0,1 0,0 0,1 0,1 1,0 1,1 1,1zm-3 -6l-6 0c-2,0 -4,0 -6,0 1,0 1,0 1,1 1,0 1,1 1,1 0,0 -1,1 -1,1 0,1 -1,1 -1,1 0,0 0,0 0,0 0,0 1,0 2,0 1,0 1,0 2,0 2,0 3,0 4,0 1,0 1,0 2,0 0,-1 1,-3 2,-4zm-28 2c-1,1 -2,1 -3,1 0,1 0,1 0,2 0,0 0,0 0,0 1,-1 2,-2 3,-3z"/>
                                <path fill="#000000"
                                      d="M180 197l0 0c13,0 24,10 24,23l0 1 -48 0 0 -1c0,-13 11,-23 24,-23z"/>
                                <path fill="#FEFEFE" d="M180 197l0 0c6,0 12,2 16,6l-32 0c4,-4 10,-6 16,-6z"/>
                                <path fill="#FF4F6D"
                                      d="M173 211c4,0 5,1 7,3 2,-2 3,-3 7,-3 5,0 11,5 12,10l-38 0c1,-5 7,-10 12,-10z"/>
                            </g>
                        </svg>

                        <svg id='accesories' xmlns='http://www.w3.org/2000/svg'
                             xmlnsXlink='http://www.w3.org/1999/xlink' width='360px' height='360px'
                             viewBox='0 0 360 360'>
                            <g id='a_earphones' style={{display: accesoriesStyle === "a_earphones" ? "block" : "none"}}>
                                <path fill='#f0f0f0'
                                      d='M101 154c1,-2 2,-3 4,-3l4 0c2,0 3,1 3,3l0 10c0,2 -1,4 -3,4l-4 0c-2,0 -3,-2 -4,-4l0 7c0,0 0,1 -1,1l0 0c0,15 10,28 25,46 4,4 7,8 11,13 5,6 10,10 14,13 7,6 13,10 17,22 1,4 1,8 1,14 0,6 -1,13 1,20 2,11 3,25 3,39 0,7 1,15 1,21l0 1 -2 0 0 -1c-1,-6 -1,-14 -1,-21 -1,-14 -1,-28 -3,-38 -2,-7 -2,-15 -1,-21 0,-5 0,-10 -1,-13 -4,-11 -10,-16 -16,-21 -5,-3 -10,-7 -15,-13 -3,-5 -7,-9 -10,-13 -16,-19 -27,-32 -27,-48l0 0c0,0 -1,-1 -1,-1 0,-5 0,-9 0,-14 0,-2 3,-3 5,-3z'/>
                                <path fill='#f0f0f0'
                                      d='M259 154c-1,-2 -2,-3 -4,-3l-4 0c-2,0 -3,1 -3,3l0 10c0,2 1,4 3,4l4 0c2,0 3,-2 4,-4l0 7c0,0 0,1 1,1l0 0c0,10 -10,18 -22,27 -9,7 -20,15 -29,26 -4,6 -11,10 -19,15 -13,8 -26,17 -25,29l1 2 2 -1 0 -1c-1,-11 11,-19 23,-27 8,-5 15,-9 20,-15 9,-11 19,-19 29,-26 12,-10 23,-17 23,-29l0 0c0,0 1,-1 1,-1 0,-5 0,-9 0,-14 0,-2 -3,-3 -5,-3z'/>
                            </g>
                            <g id='a_earring1' style={{display: accesoriesStyle === "a_earring1" ? "block" : "none"}}>
                                <path fill='#2B2A29' fillRule='nonzero'
                                      d='M103 173c0,-1 0,-3 1,-4 2,-1 4,0 4,1 1,1 1,2 2,3 0,1 0,2 0,3 0,3 -1,6 -3,8l0 0c-2,2 -5,3 -8,3 -3,0 -6,-1 -8,-3 -2,-2 -3,-5 -3,-8 0,-3 1,-6 3,-8 1,-2 4,-3 7,-3l0 0 0 1c0,2 0,3 1,4 0,0 0,0 -1,0 -1,1 -2,1 -3,2 -1,1 -2,2 -2,4 0,1 1,3 2,3 1,1 2,2 4,2 1,0 3,-1 3,-2l0 0c1,0 2,-2 2,-3 0,-1 0,-1 0,-2 0,0 0,0 -1,-1z'/>
                                <path fill='#2B2A29' fillRule='nonzero'
                                      d='M261 170c0,0 0,0 0,0 0,-1 0,-2 0,-4l0 -1c3,0 6,1 8,3 2,2 3,5 3,8 0,3 -1,6 -3,8l0 0c-2,2 -5,3 -8,3 -3,0 -6,-1 -8,-3 -2,-2 -3,-5 -3,-8 0,-1 0,-2 0,-3 1,-1 1,-2 2,-3 0,-1 2,-2 4,-1 1,1 1,3 1,4 -1,1 -1,1 -1,1 0,1 0,1 0,2 0,1 1,3 2,3 1,1 2,2 3,2 2,0 3,-1 4,-2l0 0c1,0 2,-2 2,-3 0,-2 -1,-3 -2,-4 -1,-1 -2,-2 -4,-2z'/>
                            </g>
                            <g id='a_earring2' style={{display: accesoriesStyle === "a_earring2" ? "block" : "none"}}>
                                <circle fill='gold' cx='101' cy='176' r='9'/>
                                <circle fill='gold' cx='259' cy='176' r='9'/>
                            </g>
                            <g id='a_earring3' style={{display: accesoriesStyle === "a_earring3" ? "block" : "none"}}>
                                <path fill='#57A7B3' fillRule='nonzero'
                                      d='M108 201c3,0 5,2 7,4 2,2 3,5 3,8 0,3 -1,6 -3,8l0 0c-2,2 -5,4 -8,4 -4,0 -7,-2 -9,-4 -2,-2 -3,-5 -3,-8 0,-3 1,-6 3,-8 2,-2 5,-4 7,-4l0 -25c-1,0 -2,-1 -2,-3 0,-2 2,-3 4,-3 1,0 3,1 3,3 0,2 -1,3 -2,3l0 25zm3 8c-1,-1 -3,-2 -4,-2 -2,0 -3,1 -5,2 -1,1 -1,2 -1,4 0,1 0,3 1,4 2,1 3,2 5,2 1,0 3,-1 4,-2l0 0c1,-1 1,-3 1,-4 0,-2 0,-3 -1,-4z'/>
                                <path fill='#57A7B3' fillRule='nonzero'
                                      d='M255 201c2,0 5,2 7,4 2,2 3,5 3,8 0,3 -1,6 -3,8l0 0c-2,2 -5,4 -9,4 -3,0 -6,-2 -8,-4 -2,-2 -3,-5 -3,-8 0,-3 1,-6 3,-8 2,-2 4,-4 7,-4l0 -25c-1,0 -2,-1 -2,-3 0,-2 2,-3 3,-3 2,0 4,1 4,3 0,2 -1,3 -2,3l0 25zm3 8c-2,-1 -3,-2 -5,-2 -1,0 -3,1 -4,2 -1,1 -1,2 -1,4 0,1 0,3 1,4 1,1 3,2 4,2 2,0 3,-1 5,-2l0 0c1,-1 1,-3 1,-4 0,-2 0,-3 -1,-4z'/>
                            </g>
                        </svg>
                        <svg id='eyes' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink'
                             width='360px' height='360px' viewBox='0 0 360 360'>
                            <g id='e_default'>
                                <circle fill='#000000' fillOpacity='0.7' cx='148' cy='153' r='8'/>
                                <circle fill='#000000' fillOpacity='0.7' cx='212' cy='153' r='8'/>
                            </g>
                            <g id='e_dizzy' style={{display: eyeStyle === "e_dizzy" ? 'block' : 'none'}}>
                                <polygon fill='#000000' fillOpacity='0.7' stroke='#5F4A37' strokeWidth='0.9'
                                         points='139,141 146,149 154,141 157,145 150,152 157,160 154,163 146,156 139,163 135,160 143,152 135,145 '/>
                                <polygon fill='#000000' fillOpacity='0.7'
                                         points='206,141 213,149 221,141 224,145 217,152 224,160 221,163 213,156 206,163 202,160 210,152 202,145 '/>
                            </g>
                            <g id='e_eyeroll' style={{display: eyeStyle === "e_eyeroll" ? 'block' : 'none'}}>
                                <circle fill='#FEFEFE' cx='148' cy='152' r='17'/>
                                <circle fill='#4D4D4D' stroke='#5F4A37' strokeWidth='0.9' cx='148' cy='143' r='8'/>
                                <circle fill='#FEFEFE' cx='212' cy='152' r='17'/>
                                <circle fill='#4D4D4D' cx='212' cy='143' r='8'/>
                            </g>
                            <g id='e_happy' style={{display: eyeStyle === "e_happy" ? 'block' : 'none'}}>
                                <path fill='#000000' fillOpacity='0.7'
                                      d='M131 153c-1,0 0,2 1,1 2,-2 5,-3 11,-4 7,1 9,2 11,4 2,1 3,-1 2,-1 -1,-1 -5,-7 -13,-7 -7,0 -12,6 -12,7z'/>
                                <path fill='#000000' fillOpacity='0.7'
                                      d='M202 153c0,0 1,2 2,1 2,-2 5,-3 11,-4 7,1 9,2 11,4 2,1 3,-1 2,-1 -1,-1 -5,-7 -13,-7 -7,0 -12,6 -13,7z'/>
                            </g>
                            <g id='e_close' style={{display: eyeStyle === "e_close" ? 'block' : 'none'}}>
                                <path fill='#000000' fillOpacity='0.7'
                                      d='M131 160c-1,0 0,-2 1,-1 2,2 5,3 11,4 7,-1 9,-2 11,-4 2,-1 3,1 2,1 -1,1 -5,7 -13,7 -7,0 -12,-6 -12,-7z'/>
                                <path fill='#000000' fillOpacity='0.7'
                                      d='M202 160c0,0 1,-2 2,-1 2,2 5,3 11,4 7,-1 9,-2 11,-4 2,-1 3,1 2,1 -1,1 -5,7 -13,7 -7,0 -12,-6 -13,-7z'/>
                            </g>
                            <g id='e_hearts' style={{display: eyeStyle === "e_hearts" ? 'block' : 'none'}}>
                                <path fill='#FC675E'
                                      d='M138 138c4,0 7,2 9,5 1,-3 5,-5 8,-5 6,0 10,4 10,10 0,2 -1,5 -3,7 -5,5 -10,10 -15,16l-16 -16c-2,-2 -3,-5 -3,-7 0,-6 4,-10 10,-10z'/>
                                <path fill='#FC675E'
                                      d='M204 138c4,0 7,2 9,5 2,-3 5,-5 9,-5 5,0 10,4 10,10 0,2 -2,5 -3,7 -5,5 -11,10 -16,16l-16 -16c-2,-2 -3,-5 -3,-7 0,-6 5,-10 10,-10z'/>
                            </g>
                            <g id='e_side' style={{display: eyeStyle === "e_side" ? 'block' : 'none'}}>
                                <path fill='#000000' fillOpacity='0.7'
                                      d='M229 155c0,4 -3,7 -7,7 -5,0 -8,-3 -8,-7 0,-2 1,-3 1,-5 -6,1 -9,2 -11,4 -2,1 -2,-1 -2,-1 1,-1 6,-8 14,-8 4,0 8,2 10,4 2,1 3,3 3,6z'/>
                                <path fill='#000000' fillOpacity='0.7'
                                      d='M157 155c0,4 -3,7 -7,7 -4,0 -8,-3 -8,-7 0,-2 1,-3 2,-5 -7,1 -10,2 -12,4 -1,1 -2,-1 -1,-1 0,-1 6,-8 13,-8 4,0 8,2 11,4 1,1 2,3 2,6z'/>
                            </g>
                            <g id='e_wink' style={{display: eyeStyle === "e_wink" ? 'block' : 'none'}}>
                                <path fill='#000000' fillOpacity='0.7'
                                      d='M225 155c1,1 0,3 -2,1 -2,-1 -4,-3 -11,-3 -6,0 -9,2 -11,3 -1,2 -2,0 -2,-1 1,-1 6,-7 13,-7 8,0 12,6 13,7z'/>
                                <circle fill='#000000' fillOpacity='0.7' cx='148' cy='153' r='7'/>
                            </g>
                            <g id='e_squint' style={{display: eyeStyle === "e_squint" ? 'block' : 'none'}}>
                                <path fill='#FEFEFE'
                                      d='M148 159c-6,0 -13,1 -17,1 0,-1 0,-2 0,-3 0,-9 7,-16 17,-16 9,0 16,7 16,16 0,1 0,2 0,3 -3,0 -11,-1 -16,-1z'/>
                                <path fill='#4D4D4D'
                                      d='M148 159c-2,0 -3,0 -4,0 -2,-1 -4,-3 -4,-6 0,-3 3,-6 8,-6 4,0 7,3 7,6 0,3 -1,5 -3,6 -2,0 -3,0 -4,0z'/>
                                <path fill='#FEFEFE'
                                      d='M212 159c-5,0 -13,1 -16,1 0,-1 0,-2 0,-3 0,-9 7,-16 16,-16 10,0 17,7 17,16 0,1 0,2 0,3 -4,0 -11,-1 -17,-1z'/>
                                <path fill='#4D4D4D'
                                      d='M212 159c-1,0 -2,0 -4,0 -2,-1 -3,-3 -3,-6 0,-3 3,-6 7,-6 4,0 8,3 8,6 0,3 -2,5 -4,6 -1,0 -2,0 -4,0z'/>
                            </g>
                            <g id='e_surprised' style={{display: eyeStyle === "e_surprised" ? 'block' : 'none'}}>
                                <circle fill='#FEFEFE' cx='148' cy='153' r='17'/>
                                <circle fill='#4D4D4D' stroke='#5F4A37' strokeWidth='0.9' cx='148' cy='153' r='8'/>
                                <circle fill='#FEFEFE' cx='212' cy='153' r='17'/>
                                <circle fill='#4D4D4D' cx='212' cy='153' r='8'/>
                            </g>
                            <g id='e_winkwacky' style={{display: eyeStyle === "e_winkwacky" ? 'block' : 'none'}}>
                                <path fill='#000000' fillOpacity='0.7'
                                      d='M131 156c-1,1 0,3 1,1 2,-1 5,-3 11,-3 7,0 9,2 11,3 2,2 3,0 2,-1 -1,-1 -5,-7 -13,-7 -7,0 -12,6 -12,7z'/>
                                <circle fill='#FEFEFE' cx='212' cy='153' r='15'/>
                                <circle fill='#4D4D4D' cx='212' cy='153' r='8'/>
                            </g>
                            <g id='e_cry' style={{display: eyeStyle === "e_cry" ? 'block' : 'none'}}>
                                <circle fill='#000000' fillOpacity='0.7' cx='148' cy='153' r='8'/>
                                <circle fill='#000000' fillOpacity='0.7' cx='212' cy='153' r='8'/>
                                <path fill='#92D9FF'
                                      d='M134 173c0,-3 6,-12 8,-14 2,2 7,11 7,14 0,4 -3,8 -7,8 0,0 0,0 0,0 0,0 0,0 0,0 -4,0 -8,-4 -8,-8z'/>
                            </g>
                        </svg>

                        <svg id="clothes" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                             width="360px" height="360px" viewBox="0 0 360 360">
                            <g id="c_blazer" style={{display: clothesStyle === 'c_blazer' ? '' : 'none'}}>
                                <path className="tinted" fill={fabricColor}
                                      d="M304 360l0 -13c0,-45 -34,-83 -79,-87l-1 -1c-2,0 -4,0 -6,0 1,0 1,1 1,1l-1 0 1 0c0,2 0,3 0,5l-3 2c-24,23 -48,23 -72,0l-3 -2c0,-2 0,-4 1,-6 -2,0 -4,0 -6,0l-1 1c-45,4 -79,42 -79,87l0 13 74 0 19 0 62 0 19 0 74 0z"/>
                                <path fill="#000000" fillOpacity="0.5"
                                      d="M130 360l-20 -45c3,-4 5,-7 7,-10 -2,-3 -4,-7 -7,-10l26 -36c2,0 4,0 6,0 -5,35 0,74 7,101l-19 0z"/>
                                <path fill="#000000" fillOpacity="0.5"
                                      d="M230 360l20 -45c-3,-4 -5,-7 -7,-10 2,-3 4,-7 7,-10l-26 -36c-2,0 -4,0 -6,0 5,35 0,74 -7,101l19 0z"/>
                                <path fill="#ffffff" d="M244 330c10,-10 12,-13 23,-2 -8,1 -15,2 -23,2z"/>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M220 271c-27,24 -54,23 -80,-1 0,-1 1,-3 1,-5l3 2c24,23 48,23 72,0l3 -2c0,2 1,4 1,6z"/>
                                <path fill="#000000" fillOpacity="0.3"
                                      d="M149 360l62 0c6,-24 11,-57 9,-89 -2,1 -4,3 -6,5 -4,2 -7,5 -11,7 -21,11 -42,6 -63,-12 -2,32 3,65 9,89z"/>
                            </g>
                            <g id="c_sweater" style={{display: clothesStyle === 'c_sweater' ? '' : 'none'}}>
                                <path className="tinted" fill={fabricColor}
                                      d="M304 360l0 -15c0,-44 -34,-81 -78,-85l-15 0 0 11c0,3 -1,6 -3,7l0 0c-5,11 -15,19 -28,19 -12,0 -23,-8 -27,-18l-1 -1c-2,-1 -2,-4 -2,-7l0 -11 -16 0c-44,4 -78,41 -78,85l0 15 248 0z"/>
                                <path fill="#ffffff"
                                      d="M150 271l0 -18c-4,0 -14,9 -14,23 0,10 7,18 16,23 1,-4 7,-7 10,-7 4,0 4,1 5,1l-15 -15c-2,-1 -2,-4 -2,-7z"/>
                                <path fill="#ffffff"
                                      d="M211 271l0 -18c4,0 13,9 13,23 0,10 -6,18 -16,23 -1,-4 -7,-7 -10,-7 -3,0 -3,1 -5,1l15 -15c2,-1 3,-4 3,-7z"/>
                            </g>
                            <g id="c_vneck" style={{display: clothesStyle === 'c_vneck' ? '' : 'none'}}>
                                <path className="tinted" fill={fabricColor}
                                      d="M304 360l0 -15c0,-44 -34,-81 -78,-85l-46 47 -46 -47c-44,4 -78,41 -78,85l0 15 248 0z"/>
                            </g>
                            <g id="c_overall" style={{display: clothesStyle === 'c_overall' ? '' : 'none'}}>
                                <path fill="#e0e0e0"
                                      d="M304 360l0 -15c0,-44 -34,-80 -77,-85 -2,24 -22,43 -46,43 -25,0 -45,-19 -47,-43l0 0c-44,4 -78,41 -78,85l0 15 248 0z"/>
                                <path className="tinted" fill={fabricColor}
                                      d="M260 270c-10,-5 -21,-9 -32,-10l0 57 -96 0 0 -57c-11,2 -22,5 -32,11l0 89 160 0 0 -90z"/>
                                <circle fill="#000000" fillOpacity="0.5" cx="118" cy="330" r="8"/>
                                <circle fill="#000000" fillOpacity="0.5" cx="242" cy="330" r="8"/>
                            </g>
                            <g id="c_hoodie" style={{display: clothesStyle === 'c_hoodie' ? '' : 'none'}}>
                                <path className="tinted" fill={fabricColor}
                                      d="M304 360l0 -15c0,-36 -24,-68 -56,-80 -1,-13 -17,-20 -39,-23l0 22c0,16 -13,29 -30,29l0 0c-16,0 -29,-13 -29,-29l0 -22c-22,3 -38,10 -39,23 -32,13 -55,44 -55,80l0 15 248 0z"/>
                                <path fill="#ffffff"
                                      d="M143 302l0 49c0,2 -2,4 -5,4 -2,0 -4,-2 -4,-4l0 -54c2,2 5,3 9,5z"/>
                                <path fill="#ffffff"
                                      d="M226 297l0 40c0,2 -2,4 -5,4 -2,0 -4,-2 -4,-4l0 -35c3,-2 6,-3 9,-5z"/>
                                <path fill="#000000" fillOpacity="0.4"
                                      d="M111 265c-4,2 -9,4 -14,7 10,22 36,33 69,37l0 0c-31,-5 -55,-25 -55,-42 0,-1 0,-1 0,-2z"/>
                                <path fill="#000000" fillOpacity="0.4"
                                      d="M262 272c-4,-3 -9,-5 -14,-7 0,0 0,1 0,2 0,17 -24,37 -55,42l0 0c33,-4 59,-15 69,-37z"/>
                            </g>
                        </svg>
                        <svg id="hair_front" xmlns="http://www.w3.org/2000/svg"
                             xmlnsXlink="http://www.w3.org/1999/xlink" width="360px" height="360px"
                             viewBox="0 0 360 360">
                            <g className="h_longhair" style={{display: hairStyle === 'h_longhair' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.2"
                                      d="M71 174c2,-11 -13,-62 3,-94 17,-35 36,-48 83,-51 34,-3 68,-2 99,16 13,7 21,22 28,35 5,11 8,24 9,36 0,13 -6,24 -6,43 0,2 0,3 0,5l-2 -1c-8,-3 -17,-7 -25,-12 -10,-6 -20,-13 -29,-20 -11,-9 -25,-21 -34,-33 -5,7 -13,13 -20,17 -6,4 -13,7 -19,9 -8,3 -15,6 -23,9 -8,3 -16,6 -24,10 -12,7 -17,7 -40,31zm126 -85l-1 0c0,0 0,0 0,0l1 0z"/>
                                <path className="tinted" fill={hairColor}
                                      d="M71 174c3,-11 -13,-62 3,-94 17,-35 36,-48 83,-51 34,-3 68,-2 99,16 13,7 21,22 28,35 5,11 8,24 9,36 0,13 -6,24 -6,43 -25,-9 -74,-43 -91,-70 -6,17 -31,28 -62,40 -25,8 -46,14 -63,45z"/>
                            </g>
                            <g className="h_longhairbob" style={{display: hairStyle === 'h_longhairbob' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.2"
                                      d="M111 136c13,-4 18,-9 36,-29 2,-3 4,-6 5,-9 24,24 56,38 88,45l-6 -10c2,1 22,10 26,10 0,-14 -11,2 -11,-15 0,-38 -31,-69 -69,-69l0 0c-44,0 -69,35 -69,77z"/>
                                <path className="tinted" fill={hairColor}
                                      d="M70 156l0 0c0,1 -1,3 -1,4l3 -3c17,7 84,-59 77,-72 10,16 55,44 80,49 -4,-7 -9,-10 -13,-17 16,11 53,33 72,38 -8,-32 -25,-73 -44,-95 -20,-22 -60,-22 -65,-22 -5,0 -45,-1 -65,22 -18,20 -34,61 -43,93 -1,1 -1,2 -1,3z"/>
                            </g>
                            <g className="h_hairbun" style={{display: hairStyle === 'h_hairbun' ? '' : 'none'}}>
                                <path className="tinted" fill={hairColor}
                                      d="M204 46c28,11 48,41 48,75 0,5 -1,10 -1,14l-2 0c-3,-40 -33,-64 -69,-64 -36,0 -66,24 -69,64l-2 0c0,-4 -1,-9 -1,-14 0,-34 20,-64 48,-75 -3,-3 -5,-7 -5,-12 0,-12 13,-22 29,-22 16,0 29,10 29,22 0,5 -2,9 -5,12z"/>
                            </g>
                            <g className="h_longhaircurly"
                               style={{display: hairStyle === 'h_longhaircurly' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.2"
                                      d="M97 143c2,-1 4,-3 6,-5 5,-5 17,-11 22,-19 10,-16 12,-23 16,-22 13,4 20,3 39,3 19,0 26,1 39,-3 4,-1 7,6 16,22 4,7 13,11 22,19 2,2 4,3 6,5 -11,-6 -24,-13 -31,-22 -3,-5 -6,-10 -9,-15 -1,-1 -2,-4 -4,-5 -4,1 -8,2 -12,2 -4,1 -8,1 -12,1 -5,0 -10,0 -15,0 -5,0 -10,0 -15,0 -4,0 -8,0 -12,-1 -4,0 -8,-1 -12,-2 -2,1 -3,4 -4,5 -3,5 -6,10 -9,15 -13,14 -26,16 -31,22z"/>
                                <path className="tinted" fill={hairColor}
                                      d="M59 95c9,-20 27,-34 42,-33 2,-13 13,-25 29,-32 19,-8 38,-6 50,3 12,-9 31,-11 50,-3 16,7 27,19 29,32 15,-1 33,13 42,33 13,33 -4,80 -44,43 -5,-5 -17,-11 -22,-19 -10,-16 -12,-23 -16,-22 -13,4 -20,3 -39,3 -19,0 -26,1 -39,-3 -4,-1 -6,6 -16,22 -5,8 -17,14 -22,19 -8,7 -14,19 -30,13 -18,-7 -24,-32 -14,-56z"/>
                            </g>
                            <g className="h_longhaircurvy"
                               style={{display: hairStyle === 'h_longhaircurvy' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.2"
                                      d="M112 121c8,-7 21,-11 38,-13l1 -7 1 7c6,-1 12,-2 18,-2l2 -11 2 11c12,-1 24,0 34,1l1 -6 1 7c18,2 32,7 39,15l0 5c-6,-9 -28,-15 -39,-17l-1 0 -1 0c-11,-2 -22,-2 -34,-2l-2 0 -2 0c-5,1 -11,1 -17,2l-1 0 -1 0c-11,2 -30,6 -39,13l0 -3z"/>
                                <path className="tinted" fill={hairColor}
                                      d="M183 34c50,0 67,23 80,68 4,14 13,31 20,43 5,12 0,17 0,25 8,2 23,10 30,27 4,10 -4,31 -15,38 -3,3 0,24 -6,37 -7,14 -13,13 -23,19 -7,4 23,38 4,63 -12,-22 -36,0 -51,-10 -18,-10 -18,-27 -18,-38 0,-11 10,-46 29,-65 -2,-16 18,-47 17,-60l-1 -58c-7,-8 -21,-13 -39,-15l-1 -7 -1 6c-10,-1 -22,-2 -34,-1l-2 -11 -2 11c-6,0 -12,1 -18,2l-1 -7 -1 7c-17,2 -30,6 -38,13 0,27 -1,64 0,68 2,11 19,33 17,63 -1,16 -26,29 -26,38 0,6 0,19 23,21 -6,7 -23,3 -27,1 0,5 1,5 4,10 -10,-3 -15,-11 -16,-15 -6,7 -2,14 -5,24 -22,-10 -25,-31 -26,-36 -2,-33 11,-36 9,-45 -4,-17 -19,-20 -19,-37 0,-19 23,-41 28,-47 5,-6 -1,-20 0,-30 3,-18 18,-35 19,-35 31,-44 27,-67 90,-67z"/>
                            </g>
                            <g className="h_longhairdread"
                               style={{display: hairStyle === 'h_longhairdread' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.2"
                                      d="M220 103c-6,-4 -15,-7 -22,-9 -7,-2 -16,-4 -22,-9 -8,5 -16,8 -25,11 -20,6 -26,10 -32,26 1,-4 2,-7 3,-10 1,-4 4,-7 7,-11 6,-4 13,-7 21,-9 8,-3 17,-5 26,-11 6,4 14,7 23,9 8,3 17,5 23,9 5,4 9,8 13,13 2,3 4,7 5,10 -5,-7 -11,-13 -20,-19z"/>
                                <path className="tinted" fill={hairColor}
                                      d="M233 262l-91 0c1,3 1,6 2,10 1,7 0,14 -1,21 0,8 -1,16 1,22 1,6 5,11 10,16 2,3 5,6 7,9 2,4 1,8 -2,10 -3,2 -7,1 -10,-2 -1,-3 -4,-5 -6,-8 -4,-4 -7,-9 -10,-14 0,7 2,13 5,19 1,4 0,8 -4,9 -4,2 -8,0 -9,-3 -4,-9 -6,-19 -6,-29 -4,8 -7,16 -9,27 -1,4 -4,6 -8,6 -4,-1 -6,-5 -6,-8 1,-2 1,-4 1,-6 -2,6 -5,11 -11,17 -3,3 -8,3 -10,0 -3,-3 -3,-7 0,-10 9,-9 11,-19 10,-29 -1,8 -4,15 -10,22 -2,3 -6,3 -9,1 -3,-3 -4,-7 -2,-10 6,-7 9,-16 9,-26 0,-4 -1,-7 -1,-11 -3,6 -7,12 -12,18 -2,3 -6,3 -9,1 -3,-3 -4,-7 -1,-10 10,-14 14,-25 13,-35 0,0 0,0 0,0 0,0 0,0 0,-1 -1,-6 -4,-11 -7,-16 -2,1 -3,3 -4,4 -2,2 -4,5 -5,6 0,0 1,2 2,3 1,2 2,3 3,5 1,4 -1,8 -5,9 -3,2 -7,0 -9,-4 0,-1 0,-2 -1,-3 -2,-4 -5,-8 -3,-14 2,-4 4,-8 7,-11 2,-2 4,-5 5,-7 1,-5 0,-11 0,-17 -1,-7 -2,-15 0,-23 2,-7 6,-14 10,-21 2,-3 3,-5 5,-7 1,-4 1,-14 0,-24 0,-8 0,-15 1,-19 2,-5 10,-20 17,-33 7,-12 14,-23 16,-24 1,-1 2,-2 4,-2 3,-3 9,-6 12,-9 0,-1 -1,-2 -1,-3 0,-5 0,-10 5,-14 5,-3 9,-3 14,-2 2,0 3,1 4,0 0,0 0,-1 1,-2 2,-4 4,-8 10,-10l0 0c6,0 10,2 14,4 2,1 4,2 5,2 4,0 7,-1 10,-2 5,-1 10,-3 17,-2l0 0c6,1 8,5 11,8 1,2 3,3 3,4 1,0 4,-1 6,-2 6,-2 11,-4 17,-2 7,3 11,8 14,14 2,2 3,4 5,6 4,5 10,9 16,13 3,2 5,4 8,6 0,1 2,2 3,3 6,4 11,8 14,16 3,10 4,22 5,33 0,4 1,8 1,11 1,7 2,12 3,17 2,5 4,9 7,15 1,3 4,7 6,10 2,3 4,5 6,6 4,3 4,7 2,10 -2,3 -7,4 -10,2 0,0 0,-1 0,-1 0,9 6,19 11,29 5,9 11,19 13,29 1,3 -1,7 -5,8 -1,0 -2,0 -2,0 1,5 2,11 3,16 1,4 -2,8 -5,8 -2,1 -4,0 -6,-1 1,4 1,7 2,11 1,5 2,12 4,17 1,4 -2,8 -5,9 -4,1 -8,-2 -9,-5 -2,-8 -3,-13 -4,-19 -2,-9 -3,-18 -7,-27 1,3 2,6 2,10 2,6 3,12 4,18 1,3 -1,7 -5,8 -3,1 -6,-1 -8,-3l1 3c2,8 4,15 5,22 1,4 -2,8 -6,9 -3,0 -7,-2 -8,-6 -1,-7 -3,-14 -4,-22 -2,-7 -4,-14 -5,-21 -2,12 -3,24 0,39 0,3 -2,7 -6,8 -4,1 -7,-2 -8,-6 -2,-11 -2,-20 -2,-29 -2,10 -3,22 -2,34 1,4 -2,7 -6,8 -4,0 -7,-3 -8,-7 -1,-10 -1,-21 1,-30 -3,3 -4,6 -5,10 -3,7 -2,16 1,26 1,3 -2,7 -5,8 -4,1 -8,-1 -9,-5 -3,-12 -4,-23 -1,-33 1,-1 1,-2 1,-3 -4,8 -7,17 -9,28 0,4 -4,6 -8,6 -3,-1 -6,-5 -5,-8 2,-12 5,-22 9,-30 -2,2 -3,3 -5,5 -2,3 -7,3 -10,1 -3,-3 -3,-7 -1,-10 2,-1 4,-5 8,-9 8,-10 21,-24 29,-35z"/>
                            </g>
                            <g className="h_nottoolong" style={{display: hairStyle === 'h_nottoolong' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.2"
                                      d="M249 135l0 -7c0,-38 -31,-69 -69,-69l0 0c-38,0 -69,31 -69,69l0 7 5 -6c32,-3 60,-23 80,-46 12,24 28,44 53,52z"/>
                                <path className="tinted" fill={hairColor}
                                      d="M272 146c0,-6 0,-12 0,-18 0,-51 -42,-93 -93,-93l0 0c-44,0 -82,32 -90,75 0,0 -1,0 -1,0 -7,0 -13,7 -13,16 0,7 4,15 12,16 31,-2 63,-19 97,-49 -1,10 -7,18 -14,25 16,-5 28,-17 34,-31 16,39 42,51 68,59z"/>
                            </g>
                            <g className="h_miawallace" style={{display: hairStyle === 'h_miawallace' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.2"
                                      d="M249 130l0 -2c0,-38 -31,-69 -69,-69l0 0c-38,0 -69,31 -69,69l0 1c10,-3 21,-3 34,-3l3 0 2 -11 2 11 3 0c8,0 16,0 24,0 8,0 16,0 24,0 7,0 14,0 21,0 8,0 17,1 25,4z"/>
                                <path className="tinted" fill={hairColor}
                                      d="M179 39c-64,0 -74,23 -94,83 -4,12 -8,23 -12,33l0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0c19,-29 38,-33 72,-33l5 -24 5 24c7,0 15,1 24,1 55,0 81,-6 105,32l0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0c-3,-10 -7,-21 -11,-33 -21,-60 -30,-83 -94,-83z"/>
                            </g>
                            <g className="h_longhairstraight"
                               style={{display: hairStyle === 'h_longhairstraight' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.2"
                                      d="M249 135l0 -7c0,-38 -31,-69 -69,-69l0 0c-38,0 -69,31 -69,69l0 7 5 -6c32,-3 60,-23 80,-46 12,24 28,44 53,52z"/>
                                <path className="tinted" fill={hairColor}
                                      d="M273 140l0 -11c0,-51 -42,-92 -93,-92l0 0c-50,0 -92,41 -92,92 0,74 0,148 0,222 16,-2 28,-16 28,-33 0,-59 0,-129 0,-189 31,-8 58,-25 81,-53 18,40 42,63 76,64z"/>
                            </g>
                            <g className="h_longhairstraight2"
                               style={{display: hairStyle === 'h_longhairstraight2' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.2"
                                      d="M249 136l0 -8c0,-38 -31,-69 -69,-69l0 0c-38,0 -69,31 -69,69l0 8c17,-11 34,-19 41,-22 11,-4 21,-8 31,-12 8,-4 16,-8 23,-13 1,1 3,1 4,2 7,5 14,9 20,16 1,2 19,29 19,29z"/>
                                <path className="tinted" fill={hairColor}
                                      d="M261 147c1,-27 3,-58 -1,-69 -6,-19 -26,-39 -53,-33 -5,-8 -22,-18 -47,-13 -31,7 -68,38 -69,80 -1,27 -1,56 -2,84 1,-22 6,-45 22,-60 25,-25 73,-32 94,-52 16,11 33,18 44,52l0 0c6,1 11,5 12,11z"/>
                            </g>
                            <g className="h_shorthairdreads"
                               style={{display: hairStyle === 'h_shorthairdreads' ? '' : 'none'}}>
                                <path className='tinted' fill='#bb7748' fillRule='nonzero'
                                      d='M105 91c0,0 0,-1 0,-1 -1,-2 0,-5 2,-6 1,-1 1,-2 1,-3 0,-1 -1,-1 -1,-2 -1,-3 1,-5 3,-6 1,0 2,0 3,0 0,-1 0,-1 1,-2 -2,0 -3,-2 -3,-5 1,-2 3,-4 5,-3 1,0 3,1 4,1 1,-1 2,-2 3,-4 0,0 0,-1 0,-2 0,-1 0,-3 0,-5 -1,-2 1,-4 3,-5 3,0 5,1 5,4 0,1 0,1 0,2 2,-2 4,-3 6,-4 0,-1 0,-3 0,-4 0,-3 2,-5 4,-5 3,0 5,2 5,5l0 0c1,0 3,-1 4,-1 0,-1 0,-1 0,-2 -1,-2 0,-4 2,-5 3,-1 5,0 6,3 0,0 0,1 0,1 2,-1 4,-1 7,-1 0,-1 0,-1 0,-2 0,-2 2,-4 4,-4 3,0 4,2 4,5 2,-1 4,-1 5,-1 1,-1 2,-3 4,-2 2,0 4,1 4,3 2,0 3,0 5,0 1,-1 2,-2 4,-2 2,0 3,2 4,4 1,0 2,0 4,1l0 0c0,0 0,0 1,0 2,-1 4,0 5,2 0,0 1,1 1,1 1,1 3,2 5,3 0,0 0,1 1,1 0,-1 1,-1 1,-2 2,-1 5,-1 7,1 1,1 1,4 -1,6 0,0 -1,1 -2,2 1,0 1,1 2,1 0,0 1,0 1,-1 2,0 4,-1 6,-2 2,-1 4,0 6,2 1,2 0,4 -2,5 1,1 3,1 4,2 1,0 3,-1 5,-1 2,-1 4,1 5,3 0,3 -1,5 -4,6 0,0 0,0 0,0 1,2 3,5 4,9 6,22 -1,23 -18,13 -10,-5 -26,-12 -50,-11 -13,0 -28,1 -46,8 -12,5 -18,9 -18,16 -1,13 -4,26 -4,29 -1,0 -3,0 -5,1 -1,-3 -1,-7 -2,-10 -1,-10 -2,-19 0,-26 0,-4 0,-7 0,-10zm134 16c-2,-6 4,-6 6,-4 3,3 4,7 5,11 1,3 1,21 -1,22 -4,0 -2,-9 -5,-18 -1,-6 -5,-11 -5,-11z'/>
                            </g>
                            <g id="e_close" style={{display: eyeStyle === 'e_close' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M131 160c-1,0 0,-2 1,-1 2,2 5,3 11,4 7,-1 9,-2 11,-4 2,-1 3,1 2,1 -1,1 -5,7 -13,7 -7,0 -12,-6 -12,-7z"/>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M202 160c0,0 1,-2 2,-1 2,2 5,3 11,4 7,-1 9,-2 11,-4 2,-1 3,1 2,1 -1,1 -5,7 -13,7 -7,0 -12,-6 -13,-7z"/>
                            </g>
                            <g id="e_hearts" style={{display: eyeStyle === 'e_hearts' ? '' : 'none'}}>
                                <path fill="#FC675E"
                                      d="M138 138c4,0 7,2 9,5 1,-3 5,-5 8,-5 6,0 10,4 10,10 0,2 -1,5 -3,7 -5,5 -10,10 -15,16l-16 -16c-2,-2 -3,-5 -3,-7 0,-6 4,-10 10,-10z"/>
                                <path fill="#FC675E"
                                      d="M204 138c4,0 7,2 9,5 2,-3 5,-5 9,-5 5,0 10,4 10,10 0,2 -2,5 -3,7 -5,5 -11,10 -16,16l-16 -16c-2,-2 -3,-5 -3,-7 0,-6 5,-10 10,-10z"/>
                            </g>
                            <g id="e_side" style={{display: eyeStyle === 'e_side' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M229 155c0,4 -3,7 -7,7 -5,0 -8,-3 -8,-7 0,-2 1,-3 1,-5 -6,1 -9,2 -11,4 -2,1 -2,-1 -2,-1 1,-1 6,-8 14,-8 4,0 8,2 10,4 2,1 3,3 3,6z"/>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M157 155c0,4 -3,7 -7,7 -4,0 -8,-3 -8,-7 0,-2 1,-3 2,-5 -7,1 -10,2 -12,4 -1,1 -2,-1 -1,-1 0,-1 6,-8 13,-8 4,0 8,2 11,4 1,1 2,3 2,6z"/>
                            </g>
                            <g id="e_wink" style={{display: eyeStyle === 'e_wink' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M225 155c1,1 0,3 -2,1 -2,-1 -4,-3 -11,-3 -6,0 -9,2 -11,3 -1,2 -2,0 -2,-1 1,-1 6,-7 13,-7 8,0 12,6 13,7z"/>
                                <circle fill="#000000" fillOpacity="0.7" cx="148" cy="153" r="7"/>
                            </g>
                            <g id="e_squint" style={{display: eyeStyle === 'e_squint' ? '' : 'none'}}>
                                <path fill="#FEFEFE"
                                      d="M148 159c-6,0 -13,1 -17,1 0,-1 0,-2 0,-3 0,-9 7,-16 17,-16 9,0 16,7 16,16 0,1 0,2 0,3 -3,0 -11,-1 -16,-1z"/>
                                <path fill="#4D4D4D"
                                      d="M148 159c-2,0 -3,0 -4,0 -2,-1 -4,-3 -4,-6 0,-3 3,-6 8,-6 4,0 7,3 7,6 0,3 -1,5 -3,6 -2,0 -3,0 -4,0z"/>
                                <path fill="#FEFEFE"
                                      d="M212 159c-5,0 -13,1 -16,1 0,-1 0,-2 0,-3 0,-9 7,-16 16,-16 10,0 17,7 17,16 0,1 0,2 0,3 -4,0 -11,-1 -17,-1z"/>
                                <path fill="#4D4D4D"
                                      d="M212 159c-1,0 -2,0 -4,0 -2,-1 -3,-3 -3,-6 0,-3 3,-6 7,-6 4,0 8,3 8,6 0,3 -2,5 -4,6 -1,0 -2,0 -4,0z"/>
                            </g>
                            <g id="e_surprised" style={{display: eyeStyle === 'e_surprised' ? '' : 'none'}}>
                                <circle fill="#FEFEFE" cx="148" cy="153" r="17"/>
                                <circle fill="#4D4D4D" stroke="#5F4A37" strokeWidth="0.9" cx="148" cy="153" r="8"/>
                                <circle fill="#FEFEFE" cx="212" cy="153" r="17"/>
                                <circle fill="#4D4D4D" cx="212" cy="153" r="8"/>
                            </g>
                            <g id="e_winkwacky" style={{display: eyeStyle === 'e_winkwacky' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M131 156c-1,1 0,3 1,1 2,-1 5,-3 11,-3 7,0 9,2 11,3 2,2 3,0 2,-1 -1,-1 -5,-7 -13,-7 -7,0 -12,6 -12,7z"/>
                                <circle fill="#FEFEFE" cx="212" cy="153" r="15"/>
                                <circle fill="#4D4D4D" cx="212" cy="153" r="8"/>
                            </g>
                            <g id="e_cry" style={{display: eyeStyle === 'e_cry' ? '' : 'none'}}>
                                <circle fill="#000000" fillOpacity="0.7" cx="148" cy="153" r="8"/>
                                <circle fill="#000000" fillOpacity="0.7" cx="212" cy="153" r="8"/>
                                <path fill="#92D9FF"
                                      d="M134 173c0,-3 6,-12 8,-14 2,2 7,11 7,14 0,4 -3,8 -7,8 0,0 0,0 0,0 0,0 0,0 0,0 -4,0 -8,-4 -8,-8z"/>
                            </g>
                        </svg>
                        <svg id="eyebrows" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                             width="360px" height="360px" viewBox="0 0 360 360">
                            <g id="eb_default" style={{display: eyebrowStyle === 'eb_default' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7" fillRule="nonzero"
                                      d="M128 138c-1,1 -3,1 -4,0 -1,-1 -1,-2 0,-3 5,-6 10,-9 16,-11 6,-2 13,-2 20,0 2,0 3,2 2,3 0,2 -1,3 -3,2 -6,-1 -12,-2 -17,0 -5,1 -10,4 -14,9z"/>
                                <path fill="#000000" fillOpacity="0.7" fillRule="nonzero"
                                      d="M232 138c1,1 2,1 3,0 2,-1 2,-2 1,-3 -5,-6 -11,-9 -17,-11 -6,-2 -13,-2 -20,0 -1,0 -2,2 -2,3 1,2 2,3 3,2 7,-1 13,-2 18,0 5,1 10,4 14,9z"/>
                            </g>
                            <g id="eb_default2" style={{display: eyebrowStyle === 'eb_default2' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M124 136c5,-4 11,-5 18,-6 5,-1 12,-1 20,1 -5,-6 -14,-10 -22,-7 -7,1 -13,5 -16,12z"/>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M237 136c-5,-4 -12,-5 -18,-6 -5,-1 -12,-1 -20,1 5,-6 14,-10 22,-7 7,1 13,5 16,12z"/>
                            </g>
                            <g id="eb_raised" style={{display: eyebrowStyle === 'eb_raised' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M126 136c5,-4 8,-10 14,-13 7,-3 12,-5 23,-5 -10,-3 -20,-4 -27,0 -6,4 -9,11 -10,18z"/>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M235 136c-5,-4 -8,-10 -14,-13 -8,-3 -12,-5 -23,-5 10,-3 20,-4 26,0 6,4 10,11 11,18z"/>
                            </g>
                            <g id="eb_sad" style={{display: eyebrowStyle === 'eb_sad' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7" fillRule="nonzero"
                                      d="M125 139c-2,-1 -2,-2 -2,-4 1,-1 3,-2 4,-1 0,0 1,0 1,1 6,2 12,2 17,0 5,-2 9,-6 12,-13 0,0 0,-1 1,-1 0,-2 2,-2 3,-2 2,1 2,2 2,4 -1,0 -1,1 -1,2 -4,7 -9,12 -15,15 -6,3 -14,3 -21,0 0,-1 -1,-1 -1,-1z"/>
                                <path fill="#000000" fillOpacity="0.7" fillRule="nonzero"
                                      d="M234 139c2,-1 2,-2 1,-4 0,-1 -2,-2 -3,-1 -1,0 -1,0 -1,1 -6,2 -12,2 -17,0 -5,-2 -9,-6 -12,-13 0,0 -1,-1 -1,-1 -1,-2 -2,-2 -3,-2 -2,1 -2,2 -2,4 0,0 1,1 1,2 4,7 9,12 15,15 6,3 13,3 21,0 0,-1 1,-1 1,-1z"/>
                            </g>
                            <g id="eb_sad2" style={{display: eyebrowStyle === 'eb_sad2' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M125 139c7,0 18,-1 22,-4 5,-4 11,-9 15,-15 0,5 -4,15 -10,19 -7,4 -20,4 -27,0z"/>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M235 139c-8,0 -18,-1 -23,-4 -5,-4 -10,-9 -14,-15 0,5 3,15 10,19 7,4 19,4 27,0z"/>
                            </g>
                            <g id="eb_unibrow" style={{display: eyebrowStyle === 'eb_unibrow' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M120 136c3,-5 10,-11 17,-12 7,-1 14,3 20,4 7,1 13,3 20,4 -7,4 -12,4 -18,4 -7,0 -15,-4 -22,-4 -6,0 -11,2 -17,4z"/>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M240 136c-3,-5 -10,-11 -17,-12 -7,-1 -14,3 -20,4 -7,1 -13,3 -20,4 7,4 12,4 18,4 7,0 15,-4 22,-4 6,0 11,2 17,4z"/>
                            </g>
                            <g id="eb_updown" style={{display: eyebrowStyle === 'eb_updown' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7" fillRule="nonzero"
                                      d="M128 134c-1,1 -2,1 -4,0 -1,-1 -1,-3 0,-4 7,-7 13,-10 20,-12 6,-1 12,0 18,3 2,1 2,2 2,4 -1,1 -3,2 -4,1 -5,-3 -10,-4 -15,-2 -6,1 -11,4 -17,10z"/>
                                <path fill="#000000" fillOpacity="0.7" fillRule="nonzero"
                                      d="M237 139c1,1 0,3 -1,4 -1,1 -2,1 -3,0 -5,-5 -10,-8 -16,-9 -6,-2 -12,-2 -16,0 -2,1 -3,0 -4,-1 0,-1 0,-3 2,-4 5,-2 13,-2 20,-1 6,2 12,6 18,11z"/>
                            </g>
                            <g id="eb_updown2" style={{display: eyebrowStyle === 'eb_updown2' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M126 136c5,-4 8,-10 14,-13 7,-3 12,-5 23,-5 -10,-3 -20,-4 -27,0 -6,4 -9,11 -10,18z"/>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M237 145c-6,-3 -11,-7 -18,-8 -8,-1 -13,-2 -23,2 8,-6 17,-10 25,-8 7,2 12,7 16,14z"/>
                            </g>
                            <g id="eb_angry" style={{display: eyebrowStyle === 'eb_angry' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7" fillRule="nonzero"
                                      d="M127 136c-2,1 -3,1 -4,-1 -1,-1 -1,-3 1,-3 1,-1 2,-2 3,-3 3,-3 6,-5 10,-5 3,-1 5,0 8,2 2,1 4,3 6,5 2,1 3,3 5,3 1,1 3,1 5,1 1,0 3,0 3,2 0,1 -1,3 -2,3 -3,1 -6,0 -8,-1 -3,-1 -5,-2 -7,-4 -1,-2 -3,-3 -5,-5 -1,-1 -3,-1 -5,-1 -2,0 -4,2 -6,4 -2,1 -3,2 -4,3z"/>
                                <path fill="#000000" fillOpacity="0.7" fillRule="nonzero"
                                      d="M233 136c1,1 3,1 4,-1 1,-1 0,-3 -1,-3 -1,-1 -2,-2 -3,-3 -3,-3 -6,-5 -10,-5 -3,-1 -6,0 -8,2 -2,1 -5,3 -6,5 -2,1 -3,3 -5,3 -2,1 -3,1 -5,1 -1,0 -3,0 -3,2 0,1 0,3 2,3 3,1 5,0 8,-1 2,-1 4,-2 6,-4 2,-2 4,-3 6,-5 1,-1 3,-1 5,-1 2,0 4,2 6,4 1,1 3,2 4,3z"/>
                            </g>
                            <g id="eb_angry2" style={{display: eyebrowStyle === 'eb_angry2' ? '' : 'none'}}>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M125 129c1,-4 5,-8 10,-7 5,1 9,3 13,6 5,3 12,8 17,9 -5,3 -10,2 -13,0 -5,-2 -10,-7 -16,-9 -3,-1 -7,0 -11,1z"/>
                                <path fill="#000000" fillOpacity="0.7"
                                      d="M235 129c-1,-4 -5,-8 -10,-7 -5,1 -9,3 -13,6 -5,3 -12,8 -17,9 5,3 9,2 13,0 5,-2 10,-7 15,-9 4,-1 8,0 12,1z"/>
                            </g>
                        </svg>
                        <svg id="mouths" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                             width="360px" height="360px" viewBox="0 0 360 360">
                            <g id="m_vomit" style={{display: mouthStyle === 'm_vomit' ? '' : 'none'}}>
                                <path fill="#000000"
                                      d="M180 193l0 0c13,0 24,11 24,25l0 2 -48 0 0 -2c0,-14 11,-25 24,-25z"/>
                                <path fill="#FEFEFE" d="M180 193l0 0c6,0 12,3 17,7l-34 0c5,-4 11,-7 17,-7z"/>
                                <path fill="#88C553"
                                      d="M165 211l30 0c4,0 8,4 8,8l0 6c0,4 -4,7 -8,7 -4,0 -7,-3 -7,-7 0,-3 -4,-5 -8,-5 -4,0 -7,4 -7,8 0,5 -4,8 -8,8 -4,0 -7,-3 -7,-8l0 -9c0,-4 3,-8 7,-8z"/>
                            </g>
                            <g id="m_twinkle" style={{display: mouthStyle === 'm_twinkle' ? '' : 'none'}}>
                                <path fill="#000000" fillRule="nonzero"
                                      d="M162 200c-1,-2 0,-3 2,-3 1,-1 3,0 3,1 1,3 2,5 5,6 2,2 5,3 8,3 3,0 6,-1 8,-3 3,-1 4,-3 5,-6 0,-1 2,-2 3,-1 2,0 3,1 2,3 -1,3 -4,6 -7,9 -3,2 -7,3 -11,3 -4,0 -8,-1 -11,-3 -3,-3 -6,-6 -7,-9z"/>
                            </g>
                            <g id="m_tongue" style={{display: mouthStyle === 'm_tongue' ? '' : 'none'}}>
                                <path fill="#000000"
                                      d="M180 220l0 0c17,0 31,-10 31,-23l0 -1 -62 0 0 1c0,13 14,23 31,23z"/>
                                <path fill="#FEFEFE" d="M199 196l-38 0 0 2c0,3 2,5 4,5l30 0c2,0 4,-2 4,-5l0 -2z"/>
                                <path fill="#FF4F6D"
                                      d="M194 220l0 0c0,8 -6,15 -14,15l0 0c-8,0 -14,-7 -14,-15l0 0 0 -7c0,-4 4,-8 8,-8 3,0 5,1 6,2 1,-1 3,-2 6,-2 4,0 8,4 8,8l0 7z"/>
                            </g>
                            <g id="m_smile" style={{display: mouthStyle === 'm_smile' ? '' : 'none'}}>
                                <path fill="#000000"
                                      d="M180 220l0 0c13,0 24,-10 24,-23l0 -1 -48 0 0 1c0,13 11,23 24,23z"/>
                                <path fill="#FF4F6D"
                                      d="M180 220l0 0c6,0 11,-2 16,-5 -2,-3 -5,-5 -9,-5 -3,0 -5,1 -7,2 -2,-1 -4,-2 -7,-2 -4,0 -7,2 -9,5 5,3 10,5 16,5z"/>
                                <path fill="#FEFEFE" d="M199 196l-38 0 0 2c0,3 2,5 4,5l30 0c2,0 4,-2 4,-5l0 -2z"/>
                            </g>
                            <g id="m_serious" style={{display: mouthStyle === 'm_serious' ? '' : 'none'}}>
                                <path fill="#000000"
                                      d="M168 203l24 0c2,0 3,2 3,4l0 0c0,2 -1,3 -3,3l-24 0c-2,0 -3,-1 -3,-3l0 0c0,-2 1,-4 3,-4z"/>
                            </g>
                            <g id="m_scream" style={{display: mouthStyle === 'm_scream' ? '' : 'none'}}>
                                <path fill="#000000"
                                      d="M180 196l0 0c14,0 24,11 24,24 0,4 0,8 0,11 -8,-1 -16,-2 -24,-2 -8,0 -16,1 -24,2l0 -11c0,-13 10,-24 24,-24z"/>
                                <path fill="#FEFEFE" d="M180 196l0 0c7,0 13,2 17,7l-34 0c4,-5 10,-7 17,-7z"/>
                                <path fill="#FF4F6D"
                                      d="M180 222c-2,-2 -4,-2 -6,-2 -3,0 -8,1 -9,4 -2,2 -3,3 -5,7 7,-1 13,-2 20,-2l0 0 0 0c7,0 13,1 20,2 -2,-4 -3,-5 -5,-7 -1,-3 -6,-4 -9,-4 -2,0 -4,0 -6,2z"/>
                            </g>
                            <g id="m_sad" style={{display: mouthStyle === 'm_sad' ? '' : 'none'}}>
                                <path fill="#000000"
                                      d="M197 217c0,0 0,-1 0,-2 0,-9 -7,-16 -17,-16 -10,0 -17,7 -17,16 0,1 0,2 0,2 4,-4 10,-6 17,-6 7,0 13,2 17,6z"/>
                            </g>
                            <g id="m_grimace" style={{display: mouthStyle === 'm_grimace' ? '' : 'none'}}>
                                <path fill="#FEFEFE" fillRule="nonzero"
                                      d="M204 192l-48 0c-3,0 -7,1 -9,4 -3,2 -4,5 -4,9 0,4 1,7 4,9 2,3 6,4 9,4l48 0c3,0 7,-1 9,-4 3,-2 4,-5 4,-9 0,-4 -1,-7 -4,-9 -2,-3 -6,-4 -9,-4z"/>
                                <path fill="#B2B3B3"
                                      d="M143 204l11 0 0 -12c1,0 2,0 2,0l2 0 0 12 12 0 0 -12 4 0 0 12 12 0 0 -12 4 0 0 12 12 0 0 -12 2 0c0,0 1,0 2,0l0 12 11 0c0,0 0,1 0,1 0,1 0,1 0,2l-11 0 0 11c-1,0 -2,0 -2,0l-2 0 0 -11 -12 0 0 11 -4 0 0 -11 -12 0 0 11 -4 0 0 -11 -12 0 0 11 -2 0c0,0 -1,0 -2,0l0 -11 -11 0c0,-1 0,-1 0,-2 0,0 0,-1 0,-1z"/>
                                <path fill="#000000" fillRule="nonzero"
                                      d="M156 188l48 0c4,0 9,2 12,5 3,3 5,8 5,12 0,5 -2,9 -5,12 -3,3 -8,5 -12,5l-48 0c-4,0 -9,-2 -12,-5 -3,-3 -5,-7 -5,-12 0,-4 2,-9 5,-12 3,-3 8,-5 12,-5zm48 4l-48 0c-3,0 -7,1 -9,4 -3,2 -4,5 -4,9 0,4 1,7 4,9 2,3 6,4 9,4l48 0c3,0 7,-1 9,-4 3,-2 4,-5 4,-9 0,-4 -1,-7 -4,-9 -2,-3 -6,-4 -9,-4z"/>
                            </g>
                            <g id="m_eating" style={{display: mouthStyle === 'm_eating' ? '' : 'none'}}>
                                <circle fill="#E08C65" fillOpacity="0.6" cx="134" cy="199" r="11"/>
                                <circle fill="#E08C65" fillOpacity="0.6" cx="226" cy="199" r="11"/>
                                <path fill="#000000"
                                      d="M167 201c9,3 18,3 26,0 0,-6 5,-12 12,-13 -5,3 -8,7 -8,12 0,8 7,14 14,14 1,0 1,0 1,0 -2,1 -3,1 -5,1 -7,0 -12,-4 -14,-9 -9,3 -18,3 -27,0 -2,5 -7,8 -13,8 -2,0 -3,0 -5,-1 0,0 0,0 1,0 7,0 14,-6 14,-14 0,-5 -3,-10 -8,-12 7,1 12,7 12,14 0,0 0,0 0,0z"/>
                            </g>
                            <g id="m_disbelief" style={{display: mouthStyle === 'm_disbelief' ? '' : 'none'}}>
                                <path fill="#000000"
                                      d="M180 199l0 0c10,0 17,8 17,17l0 1 -34 0 0 -1c0,-9 7,-17 17,-17z"/>
                            </g>
                            <g id="m_default" style={{display: mouthStyle === 'm_default' ? '' : 'none'}}>
                                <path fill="#000000" d="M180 217l0 0c10,0 17,-8 17,-18l0 0 -34 0 0 0c0,10 7,18 17,18z"/>
                            </g>
                            <g id="m_concerned" style={{display: mouthStyle === 'm_concerned' ? '' : 'none'}}>
                                <path fill='#000000'
                                      d='M180 197l0 0c13,0 24,10 24,23l0 1 -48 0 0 -1c0,-13 11,-23 24,-23z'/>
                                <path fill='#FEFEFE' d='M180 197l0 0c6,0 12,2 16,6l-32 0c4,-4 10,-6 16,-6z'/>
                                <path fill='#FF4F6D'
                                      d='M173 211c4,0 5,1 7,3 2,-2 3,-3 7,-3 5,0 11,5 12,10l-38 0c1,-5 7,-10 12,-10z'/>
                            </g>
                            <svg/>

                            <svg id='clothes' xmlns='http://www.w3.org/2000/svg'
                                 xmlnsXlink='http://www.w3.org/1999/xlink' width='360px' height='360px'
                                 viewBox='0 0 360 360'>
                                <g id='c_blazer' style={{display: clothesStyle === 'm_c_blazer' ? '' : 'none'}}>
                                    <path className='tinted' fill='#545454'
                                          d='M304 360l0 -13c0,-45 -34,-83 -79,-87l-1 -1c-2,0 -4,0 -6,0 1,0 1,1 1,1l-1 0 1 0c0,2 0,3 0,5l-3 2c-24,23 -48,23 -72,0l-3 -2c0,-2 0,-4 1,-6 -2,0 -4,0 -6,0l-1 1c-45,4 -79,42 -79,87l0 13 74 0 19 0 62 0 19 0 74 0z'/>
                                    <path fill='#000000' fillOpacity='0.5'
                                          d='M130 360l-20 -45c3,-4 5,-7 7,-10 -2,-3 -4,-7 -7,-10l26 -36c2,0 4,0 6,0 -5,35 0,74 7,101l-19 0z'/>
                                    <path fill='#000000' fillOpacity='0.5'
                                          d='M230 360l20 -45c-3,-4 -5,-7 -7,-10 2,-3 4,-7 7,-10l-26 -36c-2,0 -4,0 -6,0 5,35 0,74 -7,101l19 0z'/>
                                    <path fill='#ffffff' d='M244 330c10,-10 12,-13 23,-2 -8,1 -15,2 -23,2z'/>
                                    <path fill='#000000' fillOpacity='0.7'
                                          d='M220 271c-27,24 -54,23 -80,-1 0,-1 1,-3 1,-5l3 2c24,23 48,23 72,0l3 -2c0,2 1,4 1,6z'/>
                                    <path fill='#000000' fillOpacity='0.3'
                                          d='M149 360l62 0c6,-24 11,-57 9,-89 -2,1 -4,3 -6,5 -4,2 -7,5 -11,7 -21,11 -42,6 -63,-12 -2,32 3,65 9,89z'/>
                                </g>
                                <g id='c_sweater' style={{display: clothesStyle === 'm_c_sweater' ? '' : 'none'}}>
                                    <path className='tinted' fill='#545454'
                                          d='M304 360l0 -15c0,-44 -34,-81 -78,-85l-15 0 0 11c0,3 -1,6 -3,7l0 0c-5,11 -15,19 -28,19 -12,0 -23,-8 -27,-18l-1 -1c-2,-1 -2,-4 -2,-7l0 -11 -16 0c-44,4 -78,41 -78,85l0 15 248 0z'/>
                                    <path fill='#ffffff'
                                          d='M150 271l0 -18c-4,0 -14,9 -14,23 0,10 7,18 16,23 1,-4 7,-7 10,-7 4,0 4,1 5,1l-15 -15c-2,-1 -2,-4 -2,-7z'/>
                                    <path fill='#ffffff'
                                          d='M211 271l0 -18c4,0 13,9 13,23 0,10 -6,18 -16,23 -1,-4 -7,-7 -10,-7 -3,0 -3,1 -5,1l15 -15c2,-1 3,-4 3,-7z'/>
                                </g>
                                <g id='c_vneck' style={{display: clothesStyle === 'm_c_vneck' ? '' : 'none'}}>
                                    <path className='tinted' fill='#545454'
                                          d='M304 360l0 -15c0,-44 -34,-81 -78,-85l-46 47 -46 -47c-44,4 -78,41 -78,85l0 15 248 0z'/>
                                </g>
                                <g id='c_overall' style={{display: clothesStyle === 'm_c_overall' ? '' : 'none'}}>
                                    <path fill='#e0e0e0'
                                          d='M304 360l0 -15c0,-44 -34,-80 -77,-85 -2,24 -22,43 -46,43 -25,0 -45,-19 -47,-43l0 0c-44,4 -78,41 -78,85l0 15 248 0z'/>
                                    <path className='tinted' fill='#545454'
                                          d='M260 270c-10,-5 -21,-9 -32,-10l0 57 -96 0 0 -57c-11,2 -22,5 -32,11l0 89 160 0 0 -90z'/>
                                    <circle fill='#000000' fillOpacity='0.5' cx='118' cy='330' r='8'/>
                                    <circle fill='#000000' fillOpacity='0.5' cx='242' cy='330' r='8'/>
                                </g>
                                <g id='c_hoodie' style={{display: clothesStyle === 'm_c_hoodie' ? '' : 'none'}}>
                                    <path className='tinted' fill='#545454'
                                          d='M304 360l0 -15c0,-36 -24,-68 -56,-80 -1,-13 -17,-20 -39,-23l0 22c0,16 -13,29 -30,29l0 0c-16,0 -29,-13 -29,-29l0 -22c-22,3 -38,10 -39,23 -32,13 -55,44 -55,80l0 15 248 0z'/>
                                    <path fill='#ffffff'
                                          d='M143 302l0 49c0,2 -2,4 -5,4 -2,0 -4,-2 -4,-4l0 -54c2,2 5,3 9,5z'/>
                                    <path fill='#ffffff'
                                          d='M226 297l0 40c0,2 -2,4 -5,4 -2,0 -4,-2 -4,-4l0 -35c3,-2 6,-3 9,-5z'/>
                                    <path fill='#000000' fillOpacity='0.4'
                                          d='M111 265c-4,2 -9,4 -14,7 10,22 36,33 69,37l0 0c-31,-5 -55,-25 -55,-42 0,-1 0,-1 0,-2z'/>
                                    <path fill='#000000' fillOpacity='0.4'
                                          d='M262 272c-4,-3 -9,-5 -14,-7 0,0 0,1 0,2 0,17 -24,37 -55,42l0 0c33,-4 59,-15 69,-37z'/>
                                </g>
                            </svg>

                            <svg id='hair_front' xmlns='http://www.w3.org/2000/svg'
                                 xmlnsXlink='http://www.w3.org/1999/xlink' width='360px' height='360px'
                                 viewBox='0 0 360 360'>
                                <g className='h_longhair'
                                   style={{display: hairStyle === "h_longhair" ? 'block' : 'none'}}>
                                    <path fill='#000000' fillOpacity='0.2'
                                          d='M71 174c2,-11 -13,-62 3,-94 17,-35 36,-48 83,-51 34,-3 68,-2 99,16 13,7 21,22 28,35 5,11 8,24 9,36 0,13 -6,24 -6,43 0,2 0,3 0,5l-2 -1c-8,-3 -17,-7 -25,-12 -10,-6 -20,-13 -29,-20 -11,-9 -25,-21 -34,-33 -5,7 -13,13 -20,17 -6,4 -13,7 -19,9 -8,3 -15,6 -23,9 -8,3 -16,6 -24,10 -12,7 -17,7 -40,31zm126 -85l-1 0c0,0 0,0 0,0l1 0z'/>
                                    <path className='tinted' fill='#bb7748'
                                          d='M71 174c3,-11 -13,-62 3,-94 17,-35 36,-48 83,-51 34,-3 68,-2 99,16 13,7 21,22 28,35 5,11 8,24 9,36 0,13 -6,24 -6,43 -25,-9 -74,-43 -91,-70 -6,17 -31,28 -62,40 -25,8 -46,14 -63,45z'/>
                                </g>
                                <g className='h_longhairbob'
                                   style={{display: hairStyle === "h_longhairbob" ? 'block' : 'none'}}>
                                    <path fill='#000000' fillOpacity='0.2'
                                          d='M111 136c13,-4 18,-9 36,-29 2,-3 4,-6 5,-9 24,24 56,38 88,45l-6 -10c2,1 22,10 26,10 0,-14 -11,2 -11,-15 0,-38 -31,-69 -69,-69l0 0c-44,0 -69,35 -69,77z'/>
                                    <path className='tinted' fill='#bb7748'
                                          d='M70 156l0 0c0,1 -1,3 -1,4l3 -3c17,7 84,-59 77,-72 10,16 55,44 80,49 -4,-7 -9,-10 -13,-17 16,11 53,33 72,38 -8,-32 -25,-73 -44,-95 -20,-22 -60,-22 -65,-22 -5,0 -45,-1 -65,22 -18,20 -34,61 -43,93 -1,1 -1,2 -1,3z'/>
                                </g>
                                <g className='h_hairbun'
                                   style={{display: hairStyle === "h_hairbun" ? 'block' : 'none'}}>
                                    <path className='tinted' fill='#bb7748'
                                          d='M204 46c28,11 48,41 48,75 0,5 -1,10 -1,14l-2 0c-3,-40 -33,-64 -69,-64 -36,0 -66,24 -69,64l-2 0c0,-4 -1,-9 -1,-14 0,-34 20,-64 48,-75 -3,-3 -5,-7 -5,-12 0,-12 13,-22 29,-22 16,0 29,10 29,22 0,5 -2,9 -5,12z'/>
                                </g>
                                <g className='h_longhaircurly'
                                   style={{display: hairStyle === "h_longhaircurly" ? 'block' : 'none'}}>
                                    <path fill='#000000' fillOpacity='0.2'
                                          d='M97 143c2,-1 4,-3 6,-5 5,-5 17,-11 22,-19 10,-16 12,-23 16,-22 13,4 20,3 39,3 19,0 26,1 39,-3 4,-1 7,6 16,22 4,7 13,11 22,19 2,2 4,3 6,5 -11,-6 -24,-13 -31,-22 -3,-5 -6,-10 -9,-15 -1,-1 -2,-4 -4,-5 -4,1 -8,2 -12,2 -4,1 -8,1 -12,1 -5,0 -10,0 -15,0 -5,0 -10,0 -15,0 -4,0 -8,0 -12,-1 -4,0 -8,-1 -12,-2 -2,1 -3,4 -4,5 -3,5 -6,10 -9,15 -13,14 -26,16 -31,22z'/>
                                    <path className='tinted' fill='#bb7748'
                                          d='M59 95c9,-20 27,-34 42,-33 2,-13 13,-25 29,-32 19,-8 38,-6 50,3 12,-9 31,-11 50,-3 16,7 27,19 29,32 15,-1 33,13 42,33 13,33 -4,80 -44,43 -5,-5 -17,-11 -22,-19 -10,-16 -12,-23 -16,-22 -13,4 -20,3 -39,3 -19,0 -26,1 -39,-3 -4,-1 -6,6 -16,22 -5,8 -17,14 -22,19 -8,7 -14,19 -30,13 -18,-7 -24,-32 -14,-56z'/>
                                </g>
                                <g className='h_longhaircurvy'
                                   style={{display: hairStyle === "h_longhaircurvy" ? 'block' : 'none'}}>
                                    <path fill='#000000' fillOpacity='0.2'
                                          d='M112 121c8,-7 21,-11 38,-13l1 -7 1 7c6,-1 12,-2 18,-2l2 -11 2 11c12,-1 24,0 34,1l1 -6 1 7c18,2 32,7 39,15l0 5c-6,-9 -28,-15 -39,-17l-1 0 -1 0c-11,-2 -22,-2 -34,-2l-2 0 -2 0c-5,1 -11,1 -17,2l-1 0 -1 0c-11,2 -30,6 -39,13l0 -3z'/>
                                    <path className='tinted' fill='#bb7748'
                                          d='M183 34c50,0 67,23 80,68 4,14 13,31 20,43 5,12 0,17 0,25 8,2 23,10 30,27 4,10 -4,31 -15,38 -3,3 0,24 -6,37 -7,14 -13,13 -23,19 -7,4 23,38 4,63 -12,-22 -36,0 -51,-10 -18,-10 -18,-27 -18,-38 0,-11 10,-46 29,-65 -2,-16 18,-47 17,-60l-1 -58c-7,-8 -21,-13 -39,-15l-1 -7 -1 6c-10,-1 -22,-2 -34,-1l-2 -11 -2 11c-6,0 -12,1 -18,2l-1 -7 -1 7c-17,2 -30,6 -38,13 0,27 -1,64 0,68 2,11 19,33 17,63 -1,16 -26,29 -26,38 0,6 0,19 23,21 -6,7 -23,3 -27,1 0,5 1,5 4,10 -10,-3 -15,-11 -16,-15 -6,7 -2,14 -5,24 -22,-10 -25,-31 -26,-36 -2,-33 11,-36 9,-45 -4,-17 -19,-20 -19,-37 0,-19 23,-41 28,-47 5,-6 -1,-20 0,-30 3,-18 18,-35 19,-35 31,-44 27,-67 90,-67z'/>
                                </g>
                                <g className='h_longhairdread'
                                   style={{display: hairStyle === "h_longhairdread" ? 'block' : 'none'}}>
                                    <path fill='#000000' fillOpacity='0.2'
                                          d='M220 103c-6,-4 -15,-7 -22,-9 -7,-2 -16,-4 -22,-9 -8,5 -16,8 -25,11 -20,6 -26,10 -32,26 1,-4 2,-7 3,-10 1,-4 4,-7 7,-11 6,-4 13,-7 21,-9 8,-3 17,-5 26,-11 6,4 14,7 23,9 8,3 17,5 23,9 5,4 9,8 13,13 2,3 4,7 5,10 -5,-7 -11,-13 -20,-19z'/>
                                    <path className='tinted' fill='#bb7748' fillRule='nonzero'
                                          d='M138 345c1,4 0,8 -4,9 -4,2 -8,0 -9,-3 -4,-9 -6,-19 -6,-29 -4,8 -7,16 -9,27 -1,4 -4,6 -8,6 -4,-1 -6,-5 -6,-8 1,-2 1,-4 1,-6 -2,6 -5,11 -11,17 -3,3 -8,3 -10,0 -3,-3 -3,-7 0,-10 9,-9 11,-19 10,-29 -1,8 -4,15 -10,22 -2,3 -6,3 -9,1 -3,-3 -4,-7 -2,-10 6,-7 9,-16 9,-26 0,-4 -1,-7 -1,-11 -3,6 -7,12 -12,18 -2,3 -6,3 -9,1 -3,-3 -4,-7 -1,-10 10,-14 14,-25 13,-35 0,0 0,0 0,0 0,0 0,0 0,-1 -1,-6 -4,-11 -7,-16 -2,1 -3,3 -4,4 -2,2 -4,5 -5,6 0,0 1,2 2,3 1,2 2,3 3,5 1,4 -1,8 -5,9 -3,2 -7,0 -9,-4 0,-1 0,-2 -1,-3 -2,-4 -5,-8 -3,-14 2,-4 4,-8 7,-11 2,-2 4,-5 5,-7 1,-5 0,-11 0,-17 -1,-7 -2,-15 0,-23 2,-7 6,-14 10,-21 2,-3 3,-5 5,-7 1,-4 1,-14 0,-24 0,-8 0,-15 1,-19 2,-5 10,-20 17,-33 7,-12 14,-23 16,-24 1,-1 2,-2 4,-2 3,-3 9,-6 12,-9 0,-1 -1,-2 -1,-3 0,-5 0,-10 5,-14 5,-3 9,-3 14,-2 2,0 3,1 4,0 0,0 0,-1 1,-2 2,-4 4,-8 10,-10l0 0c6,0 10,2 14,4 2,1 4,2 5,2 4,0 7,-1 10,-2 5,-1 10,-3 17,-2l0 0c6,1 8,5 11,8 1,2 3,3 3,4 1,0 4,-1 6,-2 6,-2 11,-4 17,-2 7,3 11,8 14,14 2,2 3,4 5,6 4,5 10,9 16,13 3,2 5,4 8,6 0,1 2,2 3,3 6,4 11,8 14,16 3,10 4,22 5,33 0,4 1,8 1,11 1,7 2,12 3,17 2,5 4,9 7,15 1,3 4,7 6,10 2,3 4,5 6,6 4,3 4,7 2,10 -2,3 -7,4 -10,2 0,0 0,-1 0,-1 0,9 6,19 11,29 5,9 11,19 13,29 1,3 -1,7 -5,8 -1,0 -2,0 -2,0 1,5 2,11 3,16 1,4 -2,8 -5,8 -2,1 -4,0 -6,-1 1,4 1,7 2,11 1,5 2,12 4,17 1,4 -2,8 -5,9 -4,1 -8,-2 -9,-5 -2,-8 -3,-13 -4,-19 -2,-9 -3,-18 -7,-27 1,3 2,6 2,10 2,6 3,12 4,18 1,3 -1,7 -5,8 -3,1 -6,-1 -8,-3l1 3c2,8 4,15 5,22 1,4 -2,8 -6,9 -3,0 -7,-2 -8,-6 -1,-7 -3,-14 -4,-22 -2,-7 -4,-14 -5,-21 -2,12 -3,24 0,39 0,3 -2,7 -6,8 -4,1 -7,-2 -8,-6 -2,-11 -2,-20 -2,-29 -2,10 -3,22 -2,34 1,4 -2,7 -6,8 -4,0 -7,-3 -8,-7 -1,-10 -1,-21 1,-30 -3,3 -4,6 -5,10 -3,7 -2,16 1,26 1,3 -2,7 -5,8 -4,1 -8,-1 -9,-5 -3,-12 -4,-23 -1,-33 1,-1 1,-2 1,-3 -4,8 -7,17 -9,28 0,4 -4,6 -8,6 -3,-1 -6,-5 -5,-8 2,-12 5,-22 9,-30 -2,2 -3,3 -5,5 -2,3 -7,3 -10,1 -3,-3 -3,-7 -1,-10 2,-1 4,-5 8,-9 13,-15 35,-41 37,-47 2,-8 1,-21 -1,-33 0,-7 -1,-14 -1,-20 0,-9 1,-18 1,-27 2,-16 3,-31 0,-45 -1,-5 -3,-9 -5,-13 -4,-5 -8,-9 -13,-13 -6,-4 -15,-6 -23,-9 -9,-2 -17,-5 -23,-9 -9,6 -18,8 -26,11 -8,2 -15,5 -21,9 -3,4 -6,7 -7,11 -2,4 -3,9 -4,15 -1,13 -3,26 -3,39 -1,12 0,25 1,38 1,6 5,13 9,19 3,5 6,10 8,15 2,4 0,0 1,3 4,10 8,20 10,31 1,7 0,14 -1,21 0,8 -1,16 1,22 1,6 5,11 10,16 2,3 5,6 7,9 2,4 1,8 -2,10 -3,2 -7,1 -10,-2 -1,-3 -4,-5 -6,-8 -4,-4 -7,-9 -10,-14 0,7 2,13 5,19z'/>
                                </g>
                                <g className='h_nottoolong'
                                   style={{display: hairStyle === "h_nottoolong" ? 'block' : 'none'}}>
                                    <path fill='#000000' fillOpacity='0.2'
                                          d='M261 146c-1,-2 -2,-3 -3,-5 -21,-8 -40,-22 -54,-54 -6,14 -18,26 -34,31 7,-7 13,-15 14,-25 -28,25 -55,40 -80,46 -2,2 -3,3 -4,5 28,-6 54,-21 76,-39 -3,4 -5,7 -9,10l-11 11 15 -5c14,-4 25,-14 33,-26 7,14 16,26 28,36 9,7 19,12 29,15z'/>
                                    <path className='tinted' fill='#bb7748'
                                          d='M272 146c0,-6 0,-12 0,-18 0,-51 -42,-93 -93,-93l0 0c-44,0 -82,32 -90,75 0,0 -1,0 -1,0 -7,0 -13,7 -13,16 0,7 4,15 12,16 31,-2 63,-19 97,-49 -1,10 -7,18 -14,25 16,-5 28,-17 34,-31 16,39 42,51 68,59z'/>
                                </g>
                                <g className='h_miawallace'
                                   style={{display: hairStyle === "h_miawallace" ? 'block' : 'none'}}>
                                    <path fill='#000000' fillOpacity='0.2'
                                          d='M249 130l0 -2c0,-38 -31,-69 -69,-69l0 0c-38,0 -69,31 -69,69l0 1c10,-3 21,-3 34,-3l3 0 2 -11 2 11 3 0c8,0 16,0 24,0 8,0 16,0 24,0 7,0 14,0 21,0 8,0 17,1 25,4z'/>
                                    <path className='tinted' fill='#bb7748'
                                          d='M179 39c-64,0 -74,23 -94,83 -4,12 -8,23 -12,33l0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0c19,-29 38,-33 72,-33l5 -24 5 24c7,0 15,1 24,1 55,0 81,-6 105,32l0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0c-3,-10 -7,-21 -11,-33 -21,-60 -30,-83 -94,-83z'/>
                                </g>
                                <g className='h_longhairstraight'
                                   style={{display: hairStyle === "h_longhairstraight" ? 'block' : 'none'}}>
                                    <path fill='#000000' fillOpacity='0.2'
                                          d='M249 135l0 -7c0,-38 -31,-69 -69,-69l0 0c-38,0 -69,31 -69,69l0 7 5 -6c32,-3 60,-23 80,-46 12,24 28,44 53,52z'/>
                                    <path className='tinted' fill='#bb7748'
                                          d='M273 140l0 -11c0,-51 -42,-92 -93,-92l0 0c-50,0 -92,41 -92,92 0,74 0,148 0,222 16,-2 28,-16 28,-33 0,-59 0,-129 0,-189 31,-8 58,-25 81,-53 18,40 42,63 76,64z'/>
                                </g>
                                <g className='h_longhairstraight2'
                                   style={{display: hairStyle === "h_longhairstraight2" ? 'block' : 'none'}}>
                                    <path fill='#000000' fillOpacity='0.2'
                                          d='M249 136l0 -8c0,-38 -31,-69 -69,-69l0 0c-38,0 -69,31 -69,69l0 8c17,-11 34,-19 41,-22 11,-4 21,-8 31,-12 8,-4 16,-8 23,-13 1,1 3,1 4,2 7,5 14,9 20,16 1,2 19,29 19,29z'/>
                                    <path className='tinted' fill='#bb7748'
                                          d='M261 147c1,-27 3,-58 -1,-69 -6,-19 -26,-39 -53,-33 -5,-8 -22,-18 -47,-13 -31,7 -68,38 -69,80 -1,27 -1,56 -2,84 1,-22 6,-45 22,-60 25,-25 73,-32 94,-52 16,11 33,18 44,52l0 0c6,1 11,5 12,11z'/>
                                </g>
                                <g className='h_shorthairdreads'
                                   style={{display: hairStyle === "h_shorthairdreads" ? 'block' : 'none'}}>
                                    <path className='tinted' fill='#bb7748' fillRule='nonzero'
                                          d='M105 91c0,0 0,-1 0,-1 -1,-2 0,-5 2,-6 1,-1 1,-2 1,-3 0,-1 -1,-1 -1,-2 -1,-3 1,-5 3,-6 1,0 2,0 3,0 0,-1 0,-1 1,-2 -2,0 -3,-2 -3,-5 1,-2 3,-4 5,-3 1,0 3,1 4,1 1,-1 2,-2 3,-4 0,0 0,-1 0,-2 0,-1 0,-3 0,-5 -1,-2 1,-4 3,-5 3,0 5,1 5,4 0,1 0,1 0,2 2,-2 4,-3 6,-4 0,-1 0,-3 0,-4 0,-3 2,-5 4,-5 3,0 5,2 5,5l0 0c1,0 3,-1 4,-1 0,-1 0,-1 0,-2 -1,-2 0,-4 2,-5 3,-1 5,0 6,3 0,0 0,1 0,1 2,-1 4,-1 7,-1 0,-1 0,-1 0,-2 0,-2 2,-4 4,-4 3,0 4,2 4,5 2,-1 4,-1 5,-1 1,-1 2,-3 4,-2 2,0 4,1 4,3 2,0 3,0 5,0 1,-1 2,-2 4,-2 2,0 3,2 4,4 1,0 2,0 4,1l0 0c0,0 0,0 1,0 2,-1 4,0 5,2 0,0 1,1 1,1 1,1 3,2 5,3 0,0 0,1 1,1 0,-1 1,-1 1,-2 2,-1 5,-1 7,1 1,1 1,4 -1,6 0,0 -1,1 -2,2 1,0 1,1 2,1 0,0 1,0 1,-1 2,0 4,-1 6,-2 2,-1 4,0 6,2 1,2 0,4 -2,5 1,1 3,1 4,2 1,0 3,-1 5,-1 2,-1 4,1 5,3 0,3 -1,5 -4,6 0,0 0,0 0,0 1,2 3,5 4,9 6,22 -1,23 -18,13 -10,-5 -26,-12 -50,-11 -13,0 -28,1 -46,8 -12,5 -18,9 -18,16 -1,13 -4,26 -4,29 -1,0 -3,0 -5,1 -1,-3 -1,-7 -2,-10 -1,-10 -2,-19 0,-26 0,-4 0,-7 0,-10zm134 16c-2,-6 4,-6 6,-4 3,3 4,7 5,11 1,3 1,21 -1,22 -4,0 -2,-9 -5,-18 -1,-6 -5,-11 -5,-11z'/>
                                </g>
                                <g className='h_shorthairdreads2'
                                   style={{display: hairStyle === "h_shorthairdreads2" ? 'block' : 'none'}}>
                                    <path fill='#000000' fillOpacity='0.2'
                                          d='M180 59l0 0c-29,0 -55,18 -65,45 5,-7 19,-12 26,-12 6,0 17,0 25,0 5,0 10,0 14,0 5,0 9,0 13,0 9,0 18,-1 26,0 6,1 19,4 26,12 -10,-27 -36,-45 -65,-45z'/>
                                    <path className='tinted' fill='#bb7748' fillRule='nonzero'
                                          d='M126 229c-1,0 -1,0 -1,1 0,0 -1,1 -2,1 -2,2 -5,3 -7,3 -1,1 -2,1 -3,3 -1,1 -3,2 -5,1 -2,-1 -2,-3 -2,-4 2,-4 5,-5 8,-6 1,-1 2,-1 3,-2 -4,-4 -8,-8 -11,-12l0 0c-1,0 -3,0 -7,0 -1,-1 -3,-2 -2,-4 0,-2 2,-4 4,-3l0 0c-5,-7 -7,-12 -8,-16 -2,0 -4,2 -5,3 -1,2 -2,4 -3,6 0,1 -2,2 -4,2 -2,-1 -3,-3 -2,-5 1,-2 2,-5 4,-7 0,-1 0,-1 1,-2 -4,1 -9,-1 -10,-2 -2,-2 -2,-4 -1,-5 1,-2 3,-2 5,-1 1,1 3,1 6,1 1,0 2,0 3,0 -2,-1 -4,-3 -6,-5 0,-1 -1,-2 -2,-2 -1,-2 -1,-4 1,-5 1,-1 3,-1 5,0 1,1 1,2 2,2 2,2 3,4 3,3 0,0 0,0 1,-1 0,0 1,-1 1,-2 -1,-3 -2,-4 -4,-6 0,0 -1,-1 -1,-1 -4,2 -7,2 -11,2 -6,-1 -11,-5 -14,-8 -1,-1 -1,-4 0,-5 1,-1 4,-1 5,0 2,2 6,5 10,6 2,0 4,0 5,-1 0,-1 -1,-4 -1,-6l-10 -8c-2,-1 -2,-3 -1,-5 1,-1 4,-1 5,0l6 4c0,-4 1,-8 2,-14 -1,-1 -2,-2 -3,-3 -2,-2 -5,-4 -7,-5 -2,0 -3,1 -4,1 -1,1 -2,2 -3,3 -2,2 -4,2 -5,0 -2,-1 -2,-3 0,-5 1,-1 3,-3 4,-4 3,-1 5,-2 8,-2 5,1 8,3 11,6 0,0 0,0 0,-1 -2,-2 -5,-4 -8,-6l0 0c-4,-3 -7,-5 -9,-6 -2,-1 -3,-3 -2,-4 0,-2 3,-3 4,-3 3,1 7,4 11,7l0 0c0,0 0,0 1,1 0,-1 -1,-2 -1,-2 0,0 0,0 0,-1 -4,-1 -6,-4 -7,-6 0,-2 1,-4 2,-5 2,0 4,1 5,3 0,0 0,0 0,0 1,0 1,-1 1,-2 -4,-4 -6,-2 -10,1l-1 0c-1,1 -4,1 -5,-1 -1,-1 -1,-3 1,-4l1 -1c7,-5 10,-8 16,-2 0,-1 1,-1 1,-2 1,-3 3,-6 4,-8 -4,-4 -6,-11 -7,-15 0,0 -1,-1 -1,-1 0,-2 1,-4 2,-5 2,-1 4,0 5,2 0,1 0,1 0,2 1,2 2,5 3,8 0,-2 0,-3 0,-4 -1,-2 -2,-3 1,-8 -1,0 -2,-1 -2,-2 -3,-4 -5,-8 -5,-13 -1,-2 1,-4 3,-4 2,0 3,1 4,3 0,4 2,7 3,10 1,0 1,1 2,1 1,0 3,0 6,1 0,0 1,0 2,0 0,-3 1,-6 2,-9 0,-3 1,-6 2,-7 2,-2 4,-2 5,-1 2,1 2,3 1,5 0,1 -1,3 -2,5l0 0c3,-2 7,-6 11,-9 -3,-5 -3,-11 -3,-16 0,-2 0,-3 0,-5 -1,-2 1,-3 3,-3 2,0 3,1 4,3 0,2 0,3 0,5 0,4 0,8 2,12 2,-1 4,-2 6,-3 2,-5 1,-7 1,-10 0,-1 0,-2 0,-4 0,-1 1,-3 3,-3 2,0 4,1 4,3 0,1 0,2 0,3 0,3 1,5 0,7 3,0 5,-1 8,-2 0,-5 1,-7 3,-10 1,-1 1,-2 2,-3 1,-2 3,-2 5,-1 2,1 2,3 1,4 -1,2 -1,3 -1,3 -2,2 -2,4 -3,6 2,0 3,0 5,0 1,-5 2,-7 4,-9l1 0c1,-2 3,-2 5,0 1,1 1,3 0,5l-1 0c-1,1 -1,2 -2,3 3,1 6,1 10,1 -1,0 -1,-1 -2,-1 0,-1 0,-1 -1,-1 -1,-2 -1,-4 1,-5 1,-2 3,-1 5,0 0,0 0,0 0,1 2,2 4,3 5,7 1,0 2,1 3,1l4 1c6,-6 7,-7 8,-8 0,-1 1,-2 2,-4 1,-2 4,-2 5,-1 2,2 2,4 1,5 -1,2 -2,2 -2,3 -1,1 -1,3 -5,7 2,0 4,0 6,1 1,-4 3,-6 4,-8 0,-1 0,-1 1,-2 0,-2 3,-2 4,-1 2,1 3,3 2,4 0,1 -1,2 -1,2 -1,2 -2,4 -3,6 3,1 4,1 5,2 1,-2 1,-3 1,-4 1,-4 4,-6 6,-7 1,-1 3,-1 4,1 2,1 1,3 0,4 -1,1 -2,2 -3,4 -1,2 -1,6 0,11 1,0 2,0 3,1 0,0 0,0 0,0 1,-2 1,-4 2,-5 0,-2 0,-3 0,-5 0,-2 2,-3 4,-3 2,0 3,2 3,4 0,2 0,3 0,4 -1,2 -1,4 -2,7 2,1 4,2 6,3 1,-2 1,-4 1,-5 0,-2 1,-4 3,-4 2,0 4,2 4,4 0,3 0,6 -1,9 -1,1 -1,2 -1,3 0,0 0,1 0,1 0,1 0,3 1,3 1,1 1,1 2,1 1,0 2,-1 3,-1 1,-4 1,-6 0,-8 0,-1 0,-3 0,-5 0,-2 1,-4 3,-4 2,0 4,2 4,4 0,1 0,2 0,3 1,3 2,6 -1,16 0,0 -1,1 -1,2 1,2 2,4 3,7 0,-3 1,-5 1,-6 0,0 0,-1 0,-2 0,-1 2,-3 4,-2 2,0 3,2 3,4 0,0 0,0 0,1 0,2 -1,6 -3,10 -1,2 -2,3 -2,4 0,1 1,3 1,5 2,-5 3,-10 4,-10 0,-2 1,-4 3,-4 2,1 4,2 4,4 -1,2 -3,9 -5,14l0 1c1,-2 3,-4 4,-5 2,-1 4,-1 5,0 1,2 1,4 0,5 -1,1 -2,3 -4,5 -2,2 -4,4 -6,6l1 2c0,2 0,3 1,4 1,-4 2,-7 2,-8 0,-2 2,-4 4,-4 1,0 3,2 3,4 0,2 -1,6 -3,11 3,-2 6,-4 8,-4 2,0 3,2 3,4 0,2 -1,4 -3,4 -1,0 -5,2 -9,4 -1,1 -3,2 -4,3 0,0 0,0 0,1l0 0c3,0 6,1 8,1 2,0 3,1 3,3 0,2 -1,4 -3,4 -3,0 -5,-1 -8,-1l0 0c5,2 9,5 9,5 2,1 3,3 2,5 -1,1 -3,2 -5,1 -2,-1 -5,-3 -9,-5l0 0c-1,1 -1,1 -1,1 2,1 4,2 6,3 4,2 8,5 12,6 1,1 2,3 2,5 -1,1 -3,2 -5,2 -3,-2 -6,-3 -9,-5 0,1 1,3 1,4l0 1c2,1 3,2 4,3 2,1 3,4 4,8 0,3 0,6 0,10 0,2 -1,3 -3,3 -2,0 -4,-1 -4,-3 0,-4 0,-7 0,-9 -1,-2 -1,-3 -2,-4 0,0 -1,-1 -1,-1 -1,1 -2,2 -3,3 -1,1 -1,2 -2,3 2,3 4,6 6,10l0 1c1,2 1,4 -1,5 -2,1 -4,0 -5,-1l0 -2 -1 0c0,1 0,2 -1,4 5,1 5,3 6,5 0,1 1,3 2,4 1,2 1,4 -1,5 -1,1 -4,1 -5,-1 -1,-2 -2,-4 -2,-5 -1,-1 -1,-1 -5,-3 0,0 -1,0 -1,0 -1,0 -1,0 -2,0 -1,1 -3,1 -3,2 -1,2 -2,3 -2,3 2,1 4,1 7,2 0,0 1,0 2,0 2,0 3,1 3,3 0,2 -2,4 -4,4 -1,0 -1,0 -2,0 -2,-1 -4,-1 -6,-1 0,1 -1,1 -1,2 1,1 4,2 8,2 2,1 3,2 3,4 0,2 -2,4 -4,3 -6,-1 -10,-2 -12,-3 -2,2 -5,5 -8,8 0,0 0,1 1,1 3,1 6,2 9,3 1,0 3,2 2,4 0,2 -2,3 -4,3 -2,-1 -6,-2 -10,-4 1,2 1,4 1,6 1,4 2,8 2,13 -1,2 -2,3 -4,3 -2,0 -4,-2 -3,-4 0,-4 -1,-7 -2,-11 0,-3 -1,-6 -1,-10 0,-1 0,-2 0,-2 0,0 0,0 0,-1 0,0 0,-1 0,-2l0 0c-1,1 -1,1 -2,2 9,-11 14,-24 15,-38 7,-1 13,-7 13,-15l0 -15c0,-8 -6,-14 -13,-15l0 -8c0,-9 -2,-18 -5,-26 -10,-18 -39,-13 -64,-14 -25,1 -54,-4 -64,14 -3,8 -5,17 -5,26l0 8c-7,1 -13,7 -13,15l0 15c0,8 6,14 13,15 2,18 9,34 22,45 -3,1 -6,2 -7,3z'/>
                                </g>
                                <g className='h_shorthairfrizzle'
                                   style={{display: hairStyle === "h_shorthairfrizzle" ? 'block' : 'none'}}>
                                    <path className='tinted' fill='#bb7748'
                                          d='M129 82c36,0 66,0 102,0 10,-6 20,-16 22,-27 1,-11 -4,-25 -12,-33 -4,5 -12,19 -31,19 -15,1 -30,-7 -45,-4 -11,3 -16,15 -24,22 -5,4 -12,5 -15,10 -1,4 1,10 3,13z'/>
                                </g>
                                <g className='h_shorthairshaggy'
                                   style={{display: hairStyle === "h_shorthairshaggy" ? 'block' : 'none'}}>
                                    <path fill='#000000' fillOpacity='0.2'
                                          d='M247 138l0 -8c0,-37 -30,-68 -68,-68l0 0c-38,0 -102,51 -68,68l20 11 -14 12c15,-3 23,-4 35,-13 9,-7 16,-17 22,-28 0,2 -1,3 -1,5l-4 11 9 -7c8,-5 14,-14 17,-24 3,5 6,9 10,13 3,3 6,6 9,8l10 9 -4 -12c0,-1 0,-1 -1,-2 9,5 17,12 28,25z'/>
                                    <path className='tinted' fill='#bb7748'
                                          d='M78 100c19,11 27,-19 35,-33 11,-17 41,-30 72,-13 23,-8 49,3 62,21 12,17 11,43 0,63 -3,-12 -21,-24 -34,-33 1,3 1,5 3,11 -9,-9 -17,-15 -22,-29 -1,10 -8,25 -18,31 3,-7 2,-15 0,-20 -5,13 -14,29 -26,39 -13,10 -29,16 -45,18 10,-5 17,-8 19,-14 -36,18 -56,-6 -46,-41z'/>
                                </g>
                                <g className='h_shorthaircurly'
                                   style={{display: hairStyle === "h_shorthaircurly" ? 'block' : 'none'}}>
                                    <path fill='#000000' fillOpacity='0.2'
                                          d='M249 136l0 -8c0,-38 -31,-69 -69,-69l0 0c-38,0 -69,31 -69,69l0 8c4,-20 4,-32 24,-53 6,1 12,2 19,2 4,1 9,1 14,1 11,-1 26,-3 36,-9 2,1 5,2 7,3 2,1 4,2 5,3 3,7 10,11 16,15 3,15 13,21 17,38z'/>
                                    <path className='tinted' fill='#bb7748'
                                          d='M205 73c-8,5 -21,9 -38,9 -11,1 -34,-3 -33,-3 -16,14 -23,32 -23,57 -1,0 -3,1 -4,1 -2,-8 -3,-10 -3,-23 0,-12 5,-32 12,-45 -4,-4 -6,-8 -6,-14 0,-10 9,-19 21,-19 1,0 2,1 4,1 7,-7 23,-12 41,-12 21,0 39,6 44,15 1,0 2,-1 4,-1 6,0 10,4 10,8 0,1 0,2 0,3 1,-1 2,-1 3,-1 7,0 13,7 13,13 0,5 0,6 -4,9 12,16 11,47 6,66 -1,0 -1,-1 -3,-1 0,-6 1,-10 -2,-14 -6,-8 -10,-17 -12,-26 -6,-4 -14,-8 -15,-15 -4,-4 -12,-5 -15,-8z'/>
                                </g>
                                <g className='h_shorthairflat'
                                   style={{display: hairStyle === "h_shorthairflat" ? 'block' : 'none'}}>
                                    <path fill='#000000' fillOpacity='0.2'
                                          d='M246 137l3 -9c10,-36 -31,-69 -69,-69l0 0c-38,0 -75,32 -69,69l1 9c2,-14 2,-16 9,-32 4,-6 8,-11 13,-16 4,-4 7,-8 9,-13 24,3 47,2 70,0 2,3 5,6 8,9 2,3 5,5 8,7 4,3 6,7 8,12 4,10 6,23 9,33z'/>
                                    <path className='tinted' fill='#bb7748'
                                          d='M173 41l12 -1c5,0 14,-4 19,-7 0,3 -1,6 -2,9 3,-1 8,-5 12,-6 0,3 -1,4 -2,8 4,-3 9,-5 13,-4 -3,2 -4,7 -1,9 23,15 28,38 28,56l0 32c-2,0 -4,0 -6,0 -3,-56 -17,-41 -31,-65 -25,3 -49,4 -74,0 -9,20 -29,21 -29,65l-5 0 0 -32c0,-36 23,-62 66,-64z'/>
                                </g>
                                <g className='h_shorthairround'
                                   style={{display: hairStyle === "h_shorthairround" ? 'block' : 'none'}}>
                                    <path fill='#000000' fillOpacity='0.2'
                                          d='M248 136l0 -7c0,-38 -31,-69 -68,-69l0 0c-38,0 -69,31 -69,69l0 7c0,-19 12,-41 34,-48 0,1 0,2 0,3l0 3 3 0c19,1 36,-4 52,-13 3,3 8,6 12,8 6,4 13,7 19,11 3,2 6,4 8,7 7,10 6,12 9,29z'/>
                                    <path className='tinted' fill='#bb7748'
                                          d='M180 45l0 0c40,0 73,33 73,73l0 6c0,4 -1,9 -1,13 -1,0 -3,0 -4,-1 -1,-22 -2,-32 -15,-39 -14,-8 -27,-14 -32,-21 -16,9 -33,16 -52,15 0,-3 1,-6 1,-8 -30,9 -39,26 -39,53l-4 2c0,-4 -1,-10 -1,-14l0 -6c0,-40 33,-73 74,-73z'/>
                                </g>
                                <g className='h_shorthairwaved'
                                   style={{display: hairStyle === "h_shorthairwaved" ? 'block' : 'none'}}>
                                    <path fill='#000000' fillOpacity='0.2'
                                          d='M248 136l1 -8c4,-37 -31,-69 -69,-69l0 0c-38,0 -76,32 -69,69l2 8c2,-11 2,-16 9,-33 3,-6 7,-10 12,-15 3,-3 5,-5 7,-9 24,18 52,15 78,2 1,3 2,5 5,7 1,2 4,3 6,5 2,2 4,4 5,6 9,18 9,22 13,37z'/>
                                    <path className='tinted' fill='#bb7748'
                                          d='M251 136c5,-9 8,-5 8,-31 0,-31 -9,-31 -15,-44 -3,-4 15,-16 0,-31 -13,-12 -22,3 -35,3 -7,-1 -15,-3 -23,-5 -8,-2 -31,-3 -43,4 -11,8 -20,17 -21,28 -14,10 -20,27 -20,45 0,11 3,22 7,31 1,0 3,0 4,0 0,-47 19,-43 27,-62 22,19 50,18 81,2 4,18 22,5 27,60l3 0z'/>
                                </g>
                                <g className='h_shorthairsides'
                                   style={{display: hairStyle === "h_shorthairsides" ? 'block' : 'none'}}>
                                    <path className='tinted' fill='#bb7748'
                                          d='M113 136c1,-1 1,-2 1,-3 0,-12 1,-19 2,-31 0,0 -1,0 -2,0 -4,4 -10,13 -12,32 0,2 1,4 3,4 2,-1 4,-2 6,-2l2 0zm134 0c-1,-1 -1,-2 -1,-3 0,-12 -1,-19 -2,-31 0,0 1,0 2,0 4,4 10,13 12,32 0,2 -1,4 -3,4 -2,-1 -4,-2 -6,-2l-2 0z'/>
                                </g>
                            </svg>
                            <svg id='facialhair' xmlns='http://www.w3.org/2000/svg'
                                 xmlnsXlink='http://www.w3.org/1999/xlink' width='360px' height='360px'
                                 viewBox='0 0 360 360'>
                                <g id='f_magnum' style={{display: facialHairStyle === "f_magnum" ? 'block' : 'none'}}>
                                    <path className='tinted' fill='#6f2912'
                                          d='M170 201c7,-1 10,-4 10,-10 0,6 3,9 10,10 10,1 12,-3 20,-3 7,1 8,2 10,2 1,0 1,-1 1,-2 -6,-16 -26,-17 -31,-16 -6,1 -10,4 -10,9 0,-5 -4,-8 -10,-9 -5,-1 -25,0 -31,16 0,1 0,2 1,2 2,0 3,-1 10,-2 8,0 10,4 20,3z'/>
                                </g>
                                <g id='f_fancy' style={{display: facialHairStyle === "f_fancy" ? 'block' : 'none'}}>
                                    <path className='tinted' fill='#6f2912'
                                          d='M127 194c2,2 18,0 24,-5 6,-5 20,-5 25,-1 2,2 1,5 0,5 -7,4 -15,7 -22,9 -12,4 -21,1 -27,-7 -1,-1 0,-2 0,-1zm106 0c-2,2 -18,0 -24,-5 -6,-5 -20,-5 -25,-1 -2,2 -1,5 0,5 7,4 15,7 22,9 12,4 21,1 27,-7 1,-1 0,-2 0,-1z'/>
                                </g>
                                <g id='f_magestic'
                                   style={{display: facialHairStyle === "f_magestic" ? 'block' : 'none'}}>
                                    <path className='tinted' fill='#6f2912'
                                          d='M111 136c1,11 -1,61 16,60 9,0 20,-15 29,-16 13,-1 20,0 24,5 4,-5 11,-6 24,-5 9,1 20,16 29,16 17,1 15,-49 16,-60 2,13 5,25 5,38 1,11 -2,22 -4,34 -1,11 0,24 -4,35 -2,7 -9,12 -13,18 -3,3 -5,8 -8,10 -5,3 -11,3 -16,6 -18,7 -10,8 -29,8 -19,0 -11,-1 -29,-8 -5,-3 -11,-3 -16,-6 -3,-2 -5,-7 -8,-10 -4,-6 -11,-11 -13,-18 -4,-11 -3,-24 -4,-35 -2,-12 -5,-23 -4,-34 0,-13 3,-25 5,-38zm69 56c-3,3 -7,4 -13,5 -6,2 -15,4 -15,14 0,7 7,14 13,15 8,1 5,-4 15,-4 10,0 7,5 15,4 6,-1 13,-8 13,-15 0,-10 -9,-12 -15,-14 -6,-1 -10,-2 -13,-5z'/>
                                </g>
                                <g id='f_light' style={{display: facialHairStyle === "f_light" ? 'block' : 'none'}}>
                                    <path className='tinted' fill='#6f2912'
                                          d='M174 183c-5,0 -7,0 -12,0 -6,0 -12,7 -15,13 -3,4 -4,10 -10,8 -14,-2 -20,-19 -20,-36l0 -27c0,-4 -3,-6 -6,-6 0,15 0,30 0,45 0,41 31,66 69,66 38,0 69,-25 69,-66 0,-15 0,-30 0,-45 -3,0 -6,2 -6,6l0 27c0,17 -6,34 -20,36 -6,2 -7,-4 -10,-8 -3,-6 -9,-13 -15,-13 -5,0 -7,0 -12,0 -3,0 -6,2 -6,5 0,3 3,6 6,6 5,0 8,-1 14,0 7,0 10,9 9,14 0,6 -3,12 -6,16 -3,3 -7,5 -11,5 -5,0 -5,-6 -12,-6 -7,0 -7,6 -12,6 -4,0 -8,-2 -11,-5 -3,-4 -6,-10 -6,-16 -1,-5 2,-14 9,-14 6,-1 9,0 14,0 3,0 6,-3 6,-6 0,-3 -3,-5 -6,-5z'/>
                                </g>
                            </svg>
                            <svg id='glasses' xmlns='http://www.w3.org/2000/svg'
                                 xmlnsXlink='http://www.w3.org/1999/xlink' width='360px' height='360px'
                                 viewBox='0 0 360 360'>
                                <g id='g_rambo' style={{display: glassesStyle === "g_rambo" ? 'block' : 'none'}}>
                                    <path fill='#2B2A29' fillRule='nonzero'
                                          d='M106 151c-1,0 -1,-1 -1,-2 0,-1 0,-1 1,-1l4 0c1,-6 3,-11 7,-15 4,-4 11,-6 21,-6 8,0 16,1 22,3l40 0c6,-2 14,-3 22,-3 10,0 17,2 21,6 4,4 6,9 7,15l4 0c1,0 1,0 1,1 0,1 0,2 -1,2l-4 0c0,7 -3,14 -8,19 -4,5 -10,8 -19,8 -8,0 -17,-5 -23,-12 -5,-4 -9,-10 -11,-15 0,0 0,0 0,0 -1,0 -1,0 -1,-1 -1,-3 -2,-5 -3,-7 -2,-1 -3,-2 -5,-2 -2,0 -3,1 -5,2 -1,2 -2,4 -3,7 0,1 0,1 -1,1 0,0 0,0 0,0 -2,5 -6,11 -11,15 -6,7 -15,12 -23,12 -9,0 -15,-3 -19,-8 -5,-5 -8,-12 -8,-19l-4 0zm61 -19c4,3 6,6 6,10 0,0 0,0 0,0 0,0 0,0 0,-1 2,-2 4,-3 7,-3 3,0 5,1 7,3 0,1 0,1 0,1 0,0 0,0 0,0 0,-4 2,-7 6,-10l-26 0zm55 -2c-9,0 -18,1 -24,3 -5,2 -8,5 -8,9 0,7 5,15 11,22 7,6 15,11 22,11 8,0 13,-3 17,-7 5,-4 7,-11 7,-18 0,-6 -2,-11 -6,-15 -4,-3 -10,-5 -19,-5zm-60 3c-6,-2 -15,-3 -24,-3 -9,0 -15,2 -19,5 -4,4 -6,9 -6,15 0,7 2,14 7,18 4,4 9,7 17,7 7,0 15,-5 22,-11 6,-7 11,-15 11,-22 0,-4 -3,-7 -8,-9z'/>
                                    <path className='glass' fillOpacity='0.5' fill='#5B5B5B'
                                          d='M222 130c-9,0 -18,1 -24,3 -5,2 -8,5 -8,9 0,7 5,15 11,22 7,6 15,11 22,11 8,0 13,-3 17,-7 5,-4 7,-11 7,-18 0,-6 -2,-11 -6,-15 -4,-3 -10,-5 -19,-5zm-60 3c-6,-2 -15,-3 -24,-3 -9,0 -15,2 -19,5 -4,4 -6,9 -6,15 0,7 2,14 7,18 4,4 9,7 17,7 7,0 15,-5 22,-11 6,-7 11,-15 11,-22 0,-4 -3,-7 -8,-9z'/>
                                </g>
                                <g id='g_fancy' style={{display: glassesStyle === "g_fancy" ? 'block' : 'none'}}>
                                    <path fill='#E31E24'
                                          d='M180 145c5,0 13,-1 18,-3l0 0c8,-5 26,-11 34,-13 6,-1 21,-6 25,-1 0,1 1,2 1,3 3,8 -9,25 -12,31 -5,8 -13,13 -21,16 -8,2 -17,1 -24,-2 -6,-2 -12,-7 -14,-13l0 0c-1,-5 -5,-8 -7,-8l0 -10zm31 -5c-14,6 -20,8 -20,19 0,11 17,19 32,15 16,-5 25,-21 21,-32 -2,-8 -17,-7 -33,-2z'/>
                                    <path fill='#E31E24'
                                          d='M180 145c-5,0 -13,-1 -18,-3l0 0c-8,-5 -26,-11 -34,-13 -6,-1 -21,-6 -25,-1 0,1 -1,2 -1,3 -3,8 9,25 12,31 5,8 13,13 21,16 8,2 17,1 24,-2 6,-2 12,-7 14,-13l0 0c1,-5 5,-8 7,-8l0 -6 0 -4zm-31 -5c14,6 20,8 20,19 0,11 -17,19 -32,15 -16,-5 -25,-21 -21,-32 2,-8 17,-7 33,-2z'/>
                                    <path className='glass' fillOpacity='0.5' fill='#5B5B5B'
                                          d='M149 140c14,6 20,8 20,19 0,11 -17,19 -32,15 -16,-5 -25,-21 -21,-32 2,-8 17,-7 33,-2zm62 0c-14,6 -20,8 -20,19 0,11 17,19 32,15 16,-5 25,-21 21,-32 -2,-8 -17,-7 -33,-2z'/>
                                </g>
                                <g id='g_old' style={{display: glassesStyle === "g_old" ? 'block' : 'none'}}>
                                    <path fill='#4D897C'
                                          d='M180 139l-6 0c-1,0 -2,-1 -2,-2 0,0 0,0 0,0l0 0c0,0 0,0 0,0 -3,-10 -12,-16 -31,-16l-27 0c-16,0 -17,7 -17,17l0 24c0,7 7,15 13,18 4,2 8,4 12,4l20 0c8,0 15,-4 20,-9 3,-4 6,-9 7,-14l1 0c0,0 0,-1 0,-1 0,-1 0,-1 0,-1 2,-8 6,-13 10,-13l0 -7zm-61 -12l21 0c18,0 27,8 27,18l0 6c0,12 -10,29 -26,29l-14 0c-10,0 -21,-11 -21,-18l0 -23c0,-7 6,-12 13,-12z'/>
                                    <path fill='#4D897C'
                                          d='M180 139l6 0c1,0 2,-1 2,-2 0,0 0,0 0,0l0 0c0,0 0,0 0,0 3,-10 12,-16 31,-16l27 0c16,0 17,7 17,17l0 24c0,7 -7,15 -13,18 -4,2 -8,4 -12,4l-20 0c-8,0 -15,-4 -20,-9 -3,-4 -6,-9 -7,-14l-1 0c0,0 0,-1 0,-1 0,-1 0,-1 0,-1 -2,-8 -6,-13 -10,-13l0 -7zm61 -12l-21 0c-18,0 -27,8 -27,18l0 6c0,12 10,29 26,29l14 0c10,0 21,-11 21,-18l0 -23c0,-7 -6,-12 -13,-12z'/>
                                    <path className='glass' fillOpacity='0.5' fill='#5B5B5B'
                                          d='M241 127l-21 0c-18,0 -27,8 -27,18l0 6c0,12 10,29 26,29l14 0c10,0 21,-11 21,-18l0 -23c0,-7 -6,-12 -13,-12zm-122 0l21 0c18,0 27,8 27,18l0 6c0,12 -10,29 -26,29l-14 0c-10,0 -21,-11 -21,-18l0 -23c0,-7 6,-12 13,-12z'/>
                                </g>
                                <g id='g_nerd' style={{display: glassesStyle === "g_nerd" ? 'block' : 'none'}}>
                                    <path fill='#CC6F3C'
                                          d='M141 121c10,0 19,4 26,12 2,2 5,3 8,3l5 0 0 13c-3,0 -4,0 -5,2 -1,1 -2,5 -4,9 0,1 -1,1 -2,1 -1,6 -4,11 -8,15 -5,5 -12,8 -20,8 -8,0 -15,-3 -20,-8 -6,-6 -9,-13 -9,-21l0 0c-2,0 -5,-2 -5,-5 0,0 0,-1 0,-1l0 0 1 0 0 0c0,-5 -3,-7 -4,-7 -2,0 -3,-1 -3,-3 0,-2 0,-4 0,-6 0,-1 1,-3 3,-3 2,0 4,0 6,0 5,0 14,-5 15,-5 5,-2 10,-4 16,-4zm19 16c-5,-5 -12,-8 -19,-8 -7,0 -14,3 -18,8 -5,4 -8,11 -8,18 0,7 3,14 8,19 4,4 11,7 18,7 7,0 14,-3 19,-7 4,-5 7,-12 7,-19 0,-7 -3,-14 -7,-18z'/>
                                    <path fill='#CC6F3C'
                                          d='M219 121c-10,0 -19,4 -26,12 -2,2 -5,3 -8,3l-5 0 0 13c3,0 4,0 5,2 1,1 2,5 4,9 0,1 1,1 2,1 1,6 4,11 8,15 5,5 12,8 20,8 8,0 15,-3 20,-8 6,-6 9,-13 9,-21l0 0c2,0 5,-2 5,-5 0,0 0,-1 0,-1l0 0 -1 0 0 0c0,-5 3,-7 4,-7 2,0 3,-1 3,-3 0,-2 0,-4 0,-6 0,-1 -1,-3 -3,-3 -2,0 -4,0 -6,0 -5,0 -14,-5 -15,-5 -5,-2 -10,-4 -16,-4zm-19 16c5,-5 12,-8 19,-8 7,0 14,3 18,8 5,4 8,11 8,18 0,7 -3,14 -8,19 -4,4 -11,7 -18,7 -7,0 -14,-3 -19,-7 -4,-5 -7,-12 -7,-19 0,-7 3,-14 7,-18z'/>
                                    <path className='glass' fillOpacity='0.5' fill='#5B5B5B'
                                          d='M200 137c5,-5 12,-8 19,-8 7,0 14,3 18,8 5,4 8,11 8,18 0,7 -3,14 -8,19 -4,4 -11,7 -18,7 -7,0 -14,-3 -19,-7 -4,-5 -7,-12 -7,-19 0,-7 3,-14 7,-18zm-40 0c-5,-5 -12,-8 -19,-8 -7,0 -14,3 -18,8 -5,4 -8,11 -8,18 0,7 3,14 8,19 4,4 11,7 18,7 7,0 14,-3 19,-7 4,-5 7,-12 7,-19 0,-7 -3,-14 -7,-18z'/>
                                </g>
                                <g id='g_fancy2' style={{display: glassesStyle === "g_fancy2" ? 'block' : 'none'}}>
                                    <path fill='#00A0E3'
                                          d='M180 145c3,0 10,-5 17,-9 1,-1 2,-1 3,-2 1,-1 1,-1 2,-1 10,-4 27,-4 41,-3 9,0 11,-2 10,16 0,8 -1,16 -7,22 -9,8 -24,8 -35,7 -7,0 -13,-3 -18,-7 -3,-3 -5,-7 -6,-12l0 0c-1,-3 -4,-6 -7,-6l0 -5zm57 -10c-60,-10 -55,34 -26,37 34,2 40,-13 38,-24 -2,-8 -8,-12 -12,-13z'/>
                                    <path fill='#00A0E3'
                                          d='M180 145c-3,0 -10,-5 -17,-9 -1,-1 -2,-1 -3,-2 -1,-1 -1,-1 -2,-1 -10,-4 -27,-4 -41,-3 -9,0 -11,-2 -10,16 0,8 1,16 7,22 9,8 24,8 35,7 7,0 13,-3 18,-7 3,-3 5,-7 6,-12l0 0c1,-3 4,-6 7,-6l0 -5zm-57 -10c60,-10 55,34 26,37 -34,2 -40,-13 -38,-24 2,-8 8,-12 12,-13z'/>
                                    <path className='glass' fillOpacity='0.5' fill='#5B5B5B'
                                          d='M123 135c60,-10 55,34 26,37 -34,2 -40,-13 -38,-24 2,-8 8,-12 12,-13zm114 0c-60,-10 -55,34 -26,37 34,2 40,-13 38,-24 -2,-8 -8,-12 -12,-13z'/>
                                </g>
                                <g id='g_harry' style={{display: glassesStyle === "g_harry" ? 'block' : 'none'}}>
                                    <path fill='#2B2A29' fillRule='nonzero'
                                          d='M143 125c7,0 14,3 19,8 4,4 6,8 7,13 1,-1 2,-1 3,-2 2,-2 5,-4 8,-4 3,0 6,2 8,4 1,1 2,1 3,2 1,-5 3,-9 7,-13 5,-5 12,-8 19,-8 8,0 15,3 20,8 4,5 7,11 8,18l4 0c1,0 2,1 2,1 0,1 -1,2 -2,2l-4 0c-1,7 -4,13 -8,18 -5,5 -12,8 -20,8 -7,0 -14,-3 -19,-8 -5,-5 -8,-12 -8,-19 -1,-3 -2,-5 -4,-7 -2,-1 -4,-2 -6,-2 -2,0 -4,1 -6,2 -2,2 -3,4 -4,7 0,7 -3,14 -8,19 -5,5 -12,8 -19,8 -8,0 -15,-3 -20,-8 -4,-5 -7,-11 -8,-18l-4 0c-1,0 -2,-1 -2,-2 0,0 1,-1 2,-1l4 0c1,-7 4,-13 8,-18 5,-5 12,-8 20,-8zm91 11c-4,-5 -10,-8 -17,-8 -6,0 -12,3 -17,8 -4,4 -7,10 -7,16 0,7 3,13 7,17 5,5 11,7 17,7 7,0 13,-2 17,-7 5,-4 7,-10 7,-17 0,-6 -2,-12 -7,-16zm-74 0c-5,-5 -11,-8 -17,-8 -7,0 -13,3 -17,8 -5,4 -7,10 -7,16 0,7 2,13 7,17 4,5 10,7 17,7 6,0 12,-2 17,-7 4,-4 7,-10 7,-17 0,-6 -3,-12 -7,-16z'/>
                                    <path className='glass' fillOpacity='0.5' fill='#5B5B5B'
                                          d='M234 136c-4,-5 -10,-8 -17,-8 -6,0 -12,3 -17,8 -4,4 -7,10 -7,16 0,7 3,13 7,17 5,5 11,7 17,7 7,0 13,-2 17,-7 5,-4 7,-10 7,-17 0,-6 -2,-12 -7,-16zm-74 0c-5,-5 -11,-8 -17,-8 -7,0 -13,3 -17,8 -5,4 -7,10 -7,16 0,7 2,13 7,17 4,5 10,7 17,7 6,0 12,-2 17,-7 4,-4 7,-10 7,-17 0,-6 -3,-12 -7,-16z'/>
                                </g>
                            </svg>
                        </svg>

                    </svg>


                    <div id="footer">

                        <div
                            id="random"
                            style={{
                                position: "absolute",
                                bottom: "50px",
                                left: 0,
                                width: "60px",
                                height: "50px",
                                cursor: "pointer",
                                backgroundImage: "url(https://i.imgur.com/IPZeZHl.png)",
                            }}
                            onClick={generateRandomAvatar}
                        ></div>

                        <motion.div
                            id="menu"
                            animate={menuOpen ? {width: "360px", height: "460px", border: "0px"} : {width: "60px", height: "50px"}}
                            transition={{duration: 0.3, ease: "easeInOut"}}>

                            <div id="menu_lines" onClick={toggleMenu} style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "60px",
                                height: "50px",
                                cursor: "pointer"
                            }}>
                                <div id="menu1" style={{bottom: "10px"}}></div>
                                <div id="menu2" style={{bottom: "22px"}}></div>
                                <div id="menu3" style={{bottom: "34px"}}></div>
                            </div>
                            {menuOpen && (
                                <div id="menu_list" style={{border: "0px"}}>
                                    <button className="btn" onClick={() => handleMenuSelect("skincolor")}>SKIN COLOR
                                    </button>
                                    <button className="btn" onClick={() => handleMenuSelect("eyes")}>EYES</button>
                                    <button className="btn" onClick={() => handleMenuSelect("eyebrows")}>EYEBROWS
                                    </button>
                                    <button className="btn" onClick={() => handleMenuSelect("mouths")}>MOUTH</button>
                                    <button className="btn" onClick={() => handleMenuSelect("hairstyles")}>HAIR STYLES
                                    </button>
                                    <button className="btn" onClick={() => handleMenuSelect("haircolors")}>HAIR COLOR
                                    </button>
                                    <button className="btn" onClick={() => handleMenuSelect("facialhairs")}>FACIAL
                                        HAIR
                                    </button>
                                    <button className="btn" onClick={() => handleMenuSelect("clothes")}>CLOTHES</button>
                                    <button className="btn" onClick={() => handleMenuSelect("fabriccolors")}>FABRIC
                                        COLOR
                                    </button>
                                    <button className="btn" onClick={() => handleMenuSelect("glasses")}>GLASSES</button>
                                    <button className="btn" onClick={() => handleMenuSelect("glassopacity")}>GLASS
                                        OPACITY
                                    </button>
                                    <button className="btn" onClick={() => handleMenuSelect("accesories")}>ACCESSORIES
                                    </button>
                                    <button className="btn" onClick={() => handleMenuSelect("tattoos")}>TATTOOS</button>
                                    <button className="btn"
                                            onClick={() => handleMenuSelect("backgroundcolors")}>BACKGROUND COLOR
                                    </button>
                                    <hr/>
                                    <button className="btn" onClick={() => handleMenuSelect("download")}>SAVE AVATAR
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        <div id="options">
                            <div id="options_title">{optionsTitle}</div>
                            <div id="options_div">
                                {options_div}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};


export default Avatar;
