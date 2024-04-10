import { useEffect, useState, useRef } from 'react'
import iro from '@jaames/iro';
import appLogo from '../Logos/appLogo.png'
import { useNavigate } from "react-router-dom";

export default function CanvastoolBox(props) {
    const navigate = useNavigate();
    const [isToolBoxOpen, setIsToolBoxOpen] = useState(false);
    const [hideToolBox, setHideToolBox] = useState(false);
    const [pencilSize, setPencilSize] = useState(10);
    const [pencilColor, setPencilColor] = useState('#808080');
    const [eraserSize, setEraserSize] = useState(10);
    const [toolOptions, setToolOptions] = useState('pencil');
    const [customIconsInputShow, setCustomIconsInputShow] = useState(false);
    const [customIconsInputValue, setCustomIconsInputValue] = useState('');
    const [colorPickerState, setColorPickerState] = useState(null);
    const colorPickerRef = useRef(null);

    const iconPack = [
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M261.5 35.1c-3.6-1.3-7.5-1.3-11 0L44.1 110.7 256 194l211.9-83.2L261.5 35.1zM32 385.7c0 6.7 4.2 12.7 10.5 15L240 473.1V222L32 140.3V385.7zm240 87.4l197.5-72.4c6.3-2.3 10.5-8.3 10.5-15V140.3L272 222v251zM239.5 5c10.7-3.9 22.4-3.9 33 0l208 76.3c18.9 6.9 31.5 24.9 31.5 45.1V385.7c0 20.1-12.6 38.1-31.5 45.1L272.5 507c-10.7 3.9-22.4 3.9-33 0l-208-76.3C12.6 423.8 0 405.8 0 385.7V126.4c0-20.1 12.6-38.1 31.5-45.1L239.5 5z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M244 130.6l-12-13.5-4.2-4.7c-26-29.2-65.3-42.8-103.8-35.8c-53.3 9.7-92 56.1-92 110.3v3.5c0 32.3 13.4 63.1 37.1 85.1L253 446.8c.8 .7 1.9 1.2 3 1.2s2.2-.4 3-1.2L443 275.5c23.6-22 37-52.8 37-85.1v-3.5c0-54.2-38.7-100.6-92-110.3c-38.5-7-77.8 6.6-103.8 35.8l-4.2 4.7-12 13.5c-3 3.4-7.4 5.4-12 5.4s-8.9-2-12-5.4zm34.9-57.1C311 48.4 352.7 37.7 393.7 45.1C462.2 57.6 512 117.3 512 186.9v3.5c0 36-13.1 70.6-36.6 97.5c-3.4 3.8-6.9 7.5-10.7 11l-184 171.3c-.8 .8-1.7 1.5-2.6 2.2c-6.3 4.9-14.1 7.5-22.1 7.5c-9.2 0-18-3.5-24.8-9.7L47.2 299c-3.8-3.5-7.3-7.2-10.7-11C13.1 261 0 226.4 0 190.4v-3.5C0 117.3 49.8 57.6 118.3 45.1c40.9-7.4 82.6 3.2 114.7 28.4c6.7 5.3 13 11.1 18.7 17.6l4.2 4.7 4.2-4.7c4.2-4.7 8.6-9.1 13.3-13.1c1.8-1.5 3.6-3 5.4-4.5z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M230.1 137.9L160 208 288 320 224 208l96-80-6.2-21.9 .4-.4C330.6 89.3 353 80 376.2 80c48.5 0 87.8 39.3 87.8 87.8c0 23.3-9.2 45.6-25.7 62.1l-24.2 24.2L256 412.1 97.9 254.1 73.7 229.8C57.2 213.4 48 191.1 48 167.8C48 119.3 87.3 80 135.8 80c23.3 0 45.6 9.2 62.1 25.7L222.1 130l8 8zM256 480l33.9-33.9L448 288l24.2-24.2c25.5-25.5 39.8-60 39.8-96C512 92.8 451.2 32 376.2 32c-36 0-70.5 14.3-96 39.7l0 0L256 96 231.8 71.8c-25.5-25.5-60-39.8-96-39.8C60.8 32 0 92.8 0 167.8c0 36 14.3 70.5 39.8 96L64 288 222.1 446.1 256 480z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M119.4 44.1c23.3-3.9 46.8-1.9 68.6 5.3l49.8 77.5-75.4 75.4c-1.5 1.5-2.4 3.6-2.3 5.8s1 4.2 2.6 5.7l112 104c2.9 2.7 7.4 2.9 10.5 .3s3.8-7 1.7-10.4l-60.4-98.1 90.7-75.6c2.6-2.1 3.5-5.7 2.4-8.8L296.8 61.8c28.5-16.7 62.4-23.2 95.7-17.6C461.5 55.6 512 115.2 512 185.1v5.8c0 41.5-17.2 81.2-47.6 109.5L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9L47.6 300.4C17.2 272.1 0 232.4 0 190.9v-5.8c0-69.9 50.5-129.5 119.4-141z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M226.5 168.8L287.9 42.3l61.4 126.5c4.6 9.5 13.6 16.1 24.1 17.7l137.4 20.3-99.8 98.8c-7.4 7.3-10.8 17.8-9 28.1l23.5 139.5L303 407.7c-9.4-5-20.7-5-30.2 0L150.2 473.2l23.5-139.5c1.7-10.3-1.6-20.7-9-28.1L65 206.8l137.4-20.3c10.5-1.5 19.5-8.2 24.1-17.7zM424.9 509.1c8.1 4.3 17.9 3.7 25.3-1.7s11.2-14.5 9.7-23.5L433.6 328.4 544.8 218.2c6.5-6.4 8.7-15.9 5.9-24.5s-10.3-14.9-19.3-16.3L378.1 154.8 309.5 13.5C305.5 5.2 297.1 0 287.9 0s-17.6 5.2-21.6 13.5L197.7 154.8 44.5 177.5c-9 1.3-16.5 7.6-19.3 16.3s-.5 18.1 5.9 24.5L142.2 328.4 116 483.9c-1.5 9 2.2 18.1 9.7 23.5s17.3 6 25.3 1.7l137-73.2 137 73.2z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M239.7 109.4c6.1 7.7 15.5 12.1 25.3 12s19.1-4.7 25.1-12.5c8.4-11 16.9-21.7 25.6-31.1c27.8 28.8 52.1 65.5 69.8 101.1c19.6 39.4 30.5 75.7 30.5 97.6C416 388.3 328.8 480 224 480C118 480 32 388.4 32 276.5c0-29.9 14.4-70.8 40.9-115.4c24.7-41.6 59.3-85.3 100.2-124.7c23.5 22.7 45.7 47 66.6 73zm25-20c-6.9-8.6-13.9-17-21-25.2C225.6 43.6 206.7 24 187 5.5c-7.8-7.3-19.9-7.3-27.7-.1c-46.5 43.2-86 92.3-113.9 139.3C17.8 191.2 0 238.1 0 276.5C0 404.1 98.4 512 224 512c124.2 0 224-107.8 224-235.5c0-29.3-13.5-71.1-33.8-111.9c-20.7-41.4-49.9-85-84.5-118c-7.8-7.5-20.1-7.5-28-.1c-5.7 5.4-11.2 11.3-16.5 17.4c-7.3 8.4-14.2 17.2-20.5 25.5zM128 306.8c0-23.7 13-46.3 47.1-89.1c16.8 21.3 46.2 58.7 62.6 79.6c12.5 15.9 36.3 16.3 49.4 1l23.4-27.2c17.8 38.8 9.4 86.6-24.9 110.7C267.1 394 247.7 400 225.7 400c-28.2 0-52.6-9-69.8-24.7c-17-15.5-28-38.4-28-68.5zm72-109.2c-12.7-16.1-37-16.2-49.8-.1C116.8 239.4 96 270.3 96 306.8c0 38.5 14.3 70.2 38.4 92.1c23.9 21.8 56.4 33.1 91.3 33.1c28.5 0 54.1-8 77.7-23.7l0 0 .3-.2c51.2-35.7 59.1-104.2 33.9-154.6c-10.7-21.4-37.3-19.7-49.9-5.1l-24.9 29 0 0c-16.5-21-46-58.5-62.8-79.8z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" /></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 480c-88.4 0-160-71.6-160-160c0-16.2 6.1-39.2 18.3-67.5c11.9-27.6 28.5-57.5 46.6-86.8c35.9-58 76.4-110.9 94.5-133.7h1.3c18.1 22.9 58.6 75.7 94.5 133.7c18.1 29.2 34.6 59.1 46.6 86.8C345.9 280.8 352 303.8 352 320c0 88.4-71.6 160-160 160zM0 320C0 426 86 512 192 512s192-86 192-192c0-91.2-130.2-262.3-166.6-308.3C211.4 4.2 202.5 0 192.9 0h-1.8c-9.6 0-18.5 4.2-24.5 11.7C130.2 57.7 0 228.8 0 320zm112 0c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40l.7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6H426.6c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106zM117.9 421.7L78.8 206.4l62.3 49.9c31.8 25.5 79 15.1 97.2-21.4L288 135.6l49.7 99.4c18.2 36.4 65.4 46.8 97.2 21.4l62.3-49.9L458.1 421.7c-2.8 15.2-16 26.3-31.5 26.3H149.4c-15.5 0-28.7-11.1-31.5-26.3z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6H426.6c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 32c6.2 0 11.9 3.6 14.5 9.3l63.2 136.9 136.9 63.2c5.7 2.6 9.3 8.3 9.3 14.5s-3.6 11.9-9.3 14.5L301.8 333.8 238.5 470.7c-2.6 5.7-8.3 9.3-14.5 9.3s-11.9-3.6-14.5-9.3L146.2 333.8 9.3 270.5C3.6 267.9 0 262.2 0 256s3.6-11.9 9.3-14.5l136.9-63.2L209.5 41.3c2.6-5.7 8.3-9.3 14.5-9.3zm0 54.2L172.8 197c-1.6 3.5-4.4 6.2-7.8 7.8L54.2 256 165 307.2c3.5 1.6 6.2 4.4 7.8 7.8L224 425.8 275.2 315c1.6-3.5 4.4-6.2 7.8-7.8L393.8 256 283 204.8c-3.5-1.6-6.2-4.4-7.8-7.8L224 86.2z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M245.8 45.9C241.9 37.4 233.4 32 224 32s-17.9 5.4-21.8 13.9L142.7 174.7 13.9 234.2C5.4 238.1 0 246.6 0 256s5.4 17.9 13.9 21.8l128.8 59.5 59.5 128.8c3.9 8.5 12.4 13.9 21.8 13.9s17.9-5.4 21.8-13.9l59.5-128.8 128.8-59.5c8.5-3.9 13.9-12.4 13.9-21.8s-5.4-17.9-13.9-21.8L305.3 174.7 245.8 45.9z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M306.8 6.3C311.4 2.2 317.3 0 323.4 0c17.2 0 29.2 17.1 23.4 33.3L278.7 224H389c14.9 0 27 12.1 27 27c0 7.8-3.3 15.1-9.1 20.3L141.1 505.8c-4.5 4-10.4 6.2-16.5 6.2c-17.2 0-29.2-17.1-23.5-33.3L169.3 288H57.8C43.6 288 32 276.4 32 262.2c0-7.4 3.2-14.4 8.7-19.3L306.8 6.3zm.5 42.4L74.1 256H192c5.2 0 10.1 2.5 13.1 6.8s3.7 9.7 2 14.6L140.6 463.6 375.8 256H256c-5.2 0-10.1-2.5-13.1-6.8s-3.7-9.7-2-14.6l66.4-186z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 64C125.8 64 32 148.6 32 240c0 37.1 15.5 70.6 40 100c5.2 6.3 8.4 14.8 7.4 23.9c-3.1 27-11.4 52.5-25.7 76.3c-.5 .9-1.1 1.8-1.6 2.6c11.1-2.9 22.2-7 32.7-11.5L91.2 446l-6.4-14.7c17-7.4 33-16.7 48.4-27.4c8.5-5.9 19.4-7.5 29.2-4.2C193 410.1 224 416 256 416c130.2 0 224-84.6 224-176s-93.8-176-224-176zM0 240C0 125.2 114.5 32 256 32s256 93.2 256 208s-114.5 208-256 208c-36 0-70.5-6.7-103.8-17.9c-.2-.1-.5 0-.7 .1c-16.9 11.7-34.7 22.1-53.9 30.5C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.8s-1.1-12.8 3.4-17.4c8.1-8.2 15.2-18.2 21.7-29c11.7-19.6 18.7-40.6 21.3-63.1c0 0-.1-.1-.1-.2C19.6 327.1 0 286.6 0 240z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M190.6 71.4C203 47.9 227.7 32 256 32s53 15.9 65.4 39.4c3.6 6.8 11.5 10.1 18.8 7.8c25.4-7.8 54.1-1.6 74.1 18.4s26.2 48.7 18.4 74.1c-2.3 7.3 1 15.2 7.8 18.8C464.1 203 480 227.7 480 256s-15.9 53-39.4 65.4c-6.8 3.6-10.1 11.5-7.8 18.8c7.8 25.4 1.6 54.1-18.4 74.1s-48.7 26.2-74.1 18.4c-7.3-2.3-15.2 1-18.8 7.8C309 464.1 284.3 480 256 480s-53-15.9-65.4-39.4c-3.6-6.8-11.5-10.1-18.8-7.8c-25.4 7.8-54.1 1.6-74.1-18.4s-26.2-48.7-18.4-74.1c2.3-7.3-1-15.2-7.8-18.8C47.9 309 32 284.3 32 256s15.9-53 39.4-65.4c6.8-3.6 10.1-11.5 7.8-18.8c-7.8-25.4-1.6-54.1 18.4-74.1s48.7-26.2 74.1-18.4c7.3 2.3 15.2-1 18.8-7.8zM256 0c-36.1 0-68 18.1-87.1 45.6c-33-6-68.3 3.8-93.9 29.4s-35.3 60.9-29.4 93.9C18.1 188 0 219.9 0 256s18.1 68 45.6 87.1c-6 33 3.8 68.3 29.4 93.9s60.9 35.3 93.9 29.4C188 493.9 219.9 512 256 512s68-18.1 87.1-45.6c33 6 68.3-3.8 93.9-29.4s35.3-60.9 29.4-93.9C493.9 324 512 292.1 512 256s-18.1-68-45.6-87.1c6-33-3.8-68.3-29.4-93.9s-60.9-35.3-93.9-29.4C324 18.1 292.1 0 256 0zM363.3 203.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L224 297.4l-52.7-52.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l64 64c6.2 6.2 16.4 6.2 22.6 0l128-128z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0c36.8 0 68.8 20.7 84.9 51.1C373.8 41 411 49 437 75s34 63.3 23.9 96.1C491.3 187.2 512 219.2 512 256s-20.7 68.8-51.1 84.9C471 373.8 463 411 437 437s-63.3 34-96.1 23.9C324.8 491.3 292.8 512 256 512s-68.8-20.7-84.9-51.1C138.2 471 101 463 75 437s-34-63.3-23.9-96.1C20.7 324.8 0 292.8 0 256s20.7-68.8 51.1-84.9C41 138.2 49 101 75 75s63.3-34 96.1-23.9C187.2 20.7 219.2 0 256 0zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z"></path></svg>,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384H96c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H32C14.3 96 0 110.3 0 128V352c0 17.7 14.3 32 32 32z"></path></svg>
    ]
    const shapePack = ['hollowSharpSquare', 'fillSharpSquare', 'fillSquare', 'shallowSharpTriangle', 'fillSharpTriangle', 'shallowCircle', 'fillCircle', 'fillHalfCircle', 'hexagon', 'octagon']
    const colorPallete = ['#ffffff', '#000000', '#808080', '#d3d3d3', '#ff0000', '#008000', '#90ee90', '#adff2f', '#8fbc8f', '#00ff00', '#20b2aa', '#008b8b', '#00ffff', '#0000ff', '#4169e1', '#add8e6', '#ffc0cb', '#ff69b4', '#ff1493', '#ffff00', '#ffd700', '#ff7f50', '#f08080', '#ffa500', '#ff8c00', '#ff4500', '#a52a2a', '#800000', '#800080', '#663399', '#8a2be2', '#ee82ee']

    useEffect(() => {
        document.getElementById('qc_tb_canvasAndPropsContainer').addEventListener('mousedown', () => { setIsToolBoxOpen(false); setHideToolBox(true) });
        document.getElementById('qc_tb_canvasAndPropsContainer').addEventListener('mouseup', () => setHideToolBox(false));
        document.getElementById('qc_tb_canvasAndPropsContainer').addEventListener('touchstart', () => { setIsToolBoxOpen(false); setHideToolBox(true) });
        document.getElementById('qc_tb_canvasAndPropsContainer').addEventListener('touchend', () => setHideToolBox(false));
        document.getElementById('qc_tb_canvasAndPropsContainer').addEventListener('mouseout', () => setHideToolBox(false));
    }, []);

    useEffect(() => {
        if (!isToolBoxOpen)
            setToolOptions('none');

        const keyboardShortcutForCanvas = e => {
            if (document.activeElement === document.body && document.getElementById('qc_tb_createcanvasPage_canvasNameandBgCont') ? false : true && document.getElementById('qc_tb_canvasPropEdit') ? false : true) {
                if (e.key === 'B' && e.shiftKey) {
                    setIsToolBoxOpen(!isToolBoxOpen)
                }
            }
        }

        document.body.addEventListener('keyup', keyboardShortcutForCanvas);

        return () => {
            document.body.removeEventListener('keyup', keyboardShortcutForCanvas);
        }
    }, [isToolBoxOpen])

    useEffect(() => {
        let colorPicker;
        if (colorPickerRef.current && colorPickerRef.current?.childElementCount === 0) {
            colorPicker = new iro.ColorPicker("#qc_tb_canvasToolBox_colorPicker", {
                width: colorPickerRef.current.clientWidth - 10,
                color: pencilColor,
                layout: [
                    {
                        component: iro.ui.Wheel,
                    },
                    {
                        component: iro.ui.Slider,
                        options: {
                            sliderType: 'value'
                        }
                    },
                    {
                        component: iro.ui.Slider,
                        options: {
                            sliderType: 'saturation'
                        }
                    }
                ]
            });

            setColorPickerState(colorPicker)

            colorPicker.on('color:change', (clr) => {
                setPencilColor(clr.hex8String);
            });
        }
    }, [colorPickerRef.current])

    useEffect(() => {
        props.pencilSizeChange(pencilSize);
    }, [pencilSize]);

    useEffect(() => {
        props.eraserSizeChange(eraserSize);
    }, [eraserSize]);

    useEffect(() => {
        props.pencilColorChange(pencilColor);
        colorPickerState?.color.set(pencilColor);
    }, [pencilColor]);

    const deployEyeDropper = () => {
        setIsToolBoxOpen(false);
        setTimeout(() => {
            window.EyeDropper && new window.EyeDropper().open()
                .then(clr => {
                    setPencilColor(clr.sRGBHex);
                }).catch(() => { });
        }, 100);
    }

    const handlePropImg = (event) => {
        const selectedImage = event.target.files[0];
        if (selectedImage?.size / (1024 * 1024) < 3) {
            if (selectedImage && (selectedImage.type === 'image/jpeg' || selectedImage.type === 'image/png')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.src = e.target.result;
                    props.addImageProp(img);
                    setIsToolBoxOpen(false);
                    props.handleToolBoxState('move');
                };
                reader.readAsDataURL(selectedImage);
            } else {
                props.updateNotification({ type: 'red', msg: 'Invalid Input. Please choose a JPG/JPEG/PNG.' })
            }
        } else {
            props.updateNotification({ type: 'red', msg: 'Image is not supported! Please choose a different one.' })
        }
    }

    const handleDrawingBtn = () => {
        if (props.toolBoxState === 'draw') {
            if (toolOptions === 'pencil') {
                setToolOptions('none');
                setIsToolBoxOpen(false);
            } else {
                setToolOptions('pencil');
            }
        } else {
            props.handleToolBoxState('draw');
            setToolOptions('none');
            setIsToolBoxOpen(false);
        }
    }

    const handleErasingBtn = () => {
        if (props.toolBoxState === 'erase') {
            if (toolOptions === 'erase') {
                setToolOptions('none');
                setTimeout(() => {
                    setIsToolBoxOpen(false)
                }, 300);
            } else {
                setToolOptions('erase');
            }
        } else {
            props.handleToolBoxState('erase');
            setToolOptions('none');
            setTimeout(() => {
                setIsToolBoxOpen(false)
            }, 300);
        }
    }

    const handleCustomIcon = (value) => {
        let newbtn = document.createElement('button');
        newbtn.classList.add('qc_tb_canvasToolBox_shapeBtn')
        newbtn.innerHTML = value;
        if (newbtn.childNodes[0].nodeName === 'svg' && newbtn.childNodes[0].childElementCount > 0) {
            newbtn.querySelector('svg').removeAttribute('height');
            newbtn.querySelector('svg').removeAttribute('width');
            if (newbtn.querySelector('svg').hasAttribute('stroke')) {
                newbtn.querySelector('svg').setAttribute('stroke', '#808080');
            } else {
                newbtn.querySelector('svg').setAttribute('fill', '#808080');
            }
            Array.from(newbtn.querySelectorAll('path')).forEach(node => {
                if (node.hasAttribute('fill'))
                    node.removeAttribute('fill')
            })
            document.getElementById('qc_tb_canvasToolBox_shapeOption_top').appendChild(newbtn);
            setCustomIconsInputValue('');
            setCustomIconsInputShow(false);
            setIsToolBoxOpen(false);
            props.handleToolBoxState('move');
            newbtn.onclick = props.addIconProp;
            newbtn.click();
        }
    }

    return (
        <div id="qc_tb_canvasToolBox" className={hideToolBox ? 'hide' : ''}>
            <div id="qc_tb_canvasToolBox_head">
                <button className="qc_tb_canvasToolBtns" id='qc_tb_toolBoxToggleBtn' onClick={() => setIsToolBoxOpen(!isToolBoxOpen)}>
                    <img src={appLogo} alt="App Logo" />
                </button>
            </div>
            <div id="qc_tb_canvasToolBox_body" className={isToolBoxOpen ? 'full' : ''}>
                <div id="qc_tb_canvasToolBox_bodyMain">
                    <button className={`${props.toolBoxState === 'draw' ? 'active ' : ''}qc_tb_canvasToolBtns`} id='qc_tb_toolBoxPencilBtn' onClick={handleDrawingBtn}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512"><path d="M548.2 84.3L353.9 278.6 297.3 222 491.6 27.7c15.6-15.6 41-15.6 56.6 0s15.6 40.9 0 56.6zM342.6 289.9l-26.3 26.3-52.1 52.1 0 0-2.3 2.3L205.3 314l54.4-54.4 0 0L286 233.3l56.6 56.6zM168 320c8.3 0 16.4 1.2 24 3.3L252.7 384c2.2 7.6 3.3 15.7 3.3 24c0 46.3-35.7 84.2-81.1 87.7c-.7 .1-1.3 .1-1.9 .3h-5H32c-8.8 0-16-7.2-16-16s7.2-16 16-16h4c14.6 0 26.2-7.7 33.6-17.4c7.3-9.6 11.2-22 10.6-34.3c-.1-1.4-.1-2.8-.1-4.3c0-48.6 39.4-88 88-88zm101.6 65.5L559.5 95.6c21.9-21.9 21.9-57.3 0-79.2s-57.3-21.9-79.2 0l-290 290c-7.2-1.6-14.7-2.4-22.3-2.4c-57.4 0-104 46.6-104 104c0 1.7 0 3.4 .1 5c.8 17.1-11 35-28.2 35H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H168h7.8c.1 0 .2-.1 .2-.2s.1-.2 .1-.2c53.6-4.2 95.9-49 95.9-103.7c0-7.7-.8-15.2-2.4-22.5zM160.3 14.6c-18.7-18.7-49.1-18.7-67.9 0L46.6 60.5c-18.7 18.7-18.7 49.1 0 67.9L179.2 260.9l11.3-11.3-54.4-54.4 91.1-91.1 54.4 54.4 11.3-11.3L160.3 14.6zm257 279.7l53 53c10.4 10.4 18 23.3 22.2 37.4l31.6 107.5L416.7 460.6c-14.1-4.2-27-11.8-37.4-22.2l-53-53L315 396.7l53 53c12.3 12.3 27.5 21.3 44.2 26.2l121.6 35.8c2.8 .8 5.8 .1 7.9-2s2.8-5.1 2-7.9L507.9 380.2C503 363.5 494 348.3 481.7 336l-53-53-11.3 11.3zM149 25.9l66.9 66.9-91.1 91.1L57.9 117c-12.5-12.5-12.5-32.8 0-45.3l45.8-45.8c12.5-12.5 32.8-12.5 45.3 0z"></path></svg>
                    </button>
                    <button className={`${props.toolBoxState === 'erase' ? 'active ' : ''}qc_tb_canvasToolBtns`} id='qc_tb_toolBoxEraseBtn' onClick={handleErasingBtn}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512">
                            <path d="M364.3 63c-15.6-15.6-40.9-15.6-56.6 0L191 179.7 396.3 385 513 268.3c15.6-15.6 15.6-40.9 0-56.6L364.3 63zM63 307.7c-15.6 15.6-15.6 40.9 0 56.6l88 88c7.5 7.5 17.7 11.7 28.3 11.7H300.7c10.6 0 20.8-4.2 28.3-11.7l56-56L179.7 191 63 307.7zm233.4-256c21.9-21.9 57.3-21.9 79.2 0L524.3 200.4c21.9 21.9 21.9 57.3 0 79.2l-184 184c-.1 .1-.3 .3-.4 .4H536c4.4 0 8 3.6 8 8s-3.6 8-8 8H288v0H179.3c-14.9 0-29.1-5.9-39.6-16.4l-88-88c-21.9-21.9-21.9-57.3 0-79.2L296.4 51.7z">
                            </path>
                        </svg>
                    </button>
                    <button className={`${props.toolBoxState === 'move' ? 'active ' : ''}qc_tb_canvasToolBtns`} id='qc_tb_toolBoxMoveBtn' onClick={() => { props.handleToolBoxState('move'); setIsToolBoxOpen(false) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path d="m3.515 3.515 7.07 16.97 2.51-7.39 7.39-2.51-16.97-7.07Z" stroke="currentColor"></path></svg>
                    </button>
                    <button className="qc_tb_canvasToolBtns" id='qc_tb_toolBoxUndoBtn' onClick={props.undoCanvas}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                            <path d="M419.9 384.1c-70.7 90.5-201.4 106.6-292 35.8C105 402 86.9 380.2 73.7 356.3c-2.1-3.9-7-5.3-10.9-3.2s-5.3 7-3.2 10.9c14.2 25.8 33.7 49.3 58.4 68.6c97.5 76.2 238.3 58.9 314.4-38.6s58.9-238.3-38.6-314.4C304.1 9.3 177.5 18.5 98.6 96.6l11.3 11.3c73.3-72.5 190.8-81 274.2-15.8c90.5 70.7 106.6 201.4 35.8 292zM32 192c-4.4 0-8-3.6-8-8V64c0-3.2 1.9-6.2 4.9-7.4s6.4-.6 8.7 1.7l120 120c2.3 2.3 3 5.7 1.7 8.7s-4.2 4.9-7.4 4.9H32zm120 16c9.7 0 18.5-5.8 22.2-14.8s1.7-19.3-5.2-26.2L49 47c-6.9-6.9-17.2-8.9-26.2-5.2S8 54.3 8 64V184c0 13.3 10.7 24 24 24H152z">
                            </path>
                        </svg>
                    </button>
                    <button className="qc_tb_canvasToolBtns" id='qc_tb_toolBoxClearBtn' onClick={props.clearCanvas}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                            <path d="M420 431.3L80.7 92C40.6 134.9 16 192.6 16 256c0 132.5 107.5 240 240 240c63.4 0 121.1-24.6 164-64.7zM431.3 420C471.4 377.1 496 319.4 496 256C496 123.5 388.5 16 256 16C192.6 16 134.9 40.6 92 80.7L431.3 420zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z">
                            </path>
                        </svg>
                    </button>
                    <button className="qc_tb_canvasToolBtns" id='qc_tb_toolBoxImageBtn'>
                        <input type="file" accept=".jpg, .png, .jpeg" onInput={handlePropImg} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                            <path d="M64 48C37.5 48 16 69.5 16 96V356.7l89.4-89.4c12.5-12.5 32.8-12.5 45.3 0L224 340.7 361.4 203.3c12.5-12.5 32.8-12.5 45.3 0L496 292.7V96c0-26.5-21.5-48-48-48H64zM16 379.3V416c0 26.5 21.5 48 48 48h36.7l112-112-73.4-73.4c-6.2-6.2-16.4-6.2-22.6 0L16 379.3zM395.3 214.6c-6.2-6.2-16.4-6.2-22.6 0L123.3 464H448c26.5 0 48-21.5 48-48V315.3L395.3 214.6zM0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm168 64a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm-96 0a56 56 0 1 1 112 0A56 56 0 1 1 72 160z">
                            </path>
                        </svg>
                    </button>
                    <button className={`qc_tb_canvasToolBtns`} id='qc_tb_toolBoxShapesBtn' onClick={() => { props.handleToolBoxState('move'); setToolOptions('shape') }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                            <path d="M301.7 23.8c-2.9-4.8-8.1-7.8-13.7-7.8s-10.8 2.9-13.7 7.8l-96 160c-3 4.9-3 11.1-.2 16.1s8.2 8.1 13.9 8.1H384c5.8 0 11.1-3.1 13.9-8.1s2.8-11.2-.2-16.1l-96-160zM288 0c11.2 0 21.7 5.9 27.4 15.5l96 160c5.9 9.9 6.1 22.2 .4 32.2s-16.3 16.2-27.8 16.2H192c-11.5 0-22.2-6.2-27.8-16.2s-5.5-22.3 .4-32.2l96-160C266.3 5.9 276.8 0 288 0zM472 288H328c-13.3 0-24 10.7-24 24V456c0 13.3 10.7 24 24 24H472c13.3 0 24-10.7 24-24V312c0-13.3-10.7-24-24-24zM328 272H472c22.1 0 40 17.9 40 40V456c0 22.1-17.9 40-40 40H328c-22.1 0-40-17.9-40-40V312c0-22.1 17.9-40 40-40zM240 384A112 112 0 1 0 16 384a112 112 0 1 0 224 0zM0 384a128 128 0 1 1 256 0A128 128 0 1 1 0 384z">
                            </path>
                        </svg>
                    </button>
                    <button className="qc_tb_canvasToolBtns" id='qc_tb_toolBoxTextBtn' onClick={() => { props.handleToolBoxState('move'); setIsToolBoxOpen(false); props.addTextProp() }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
                            <path d="M0 64C0 46.3 14.3 32 32 32H416c17.7 0 32 14.3 32 32v48c0 8.8-7.2 16-16 16s-16-7.2-16-16V64H240l0 384h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16h64l0-384H32v48c0 8.8-7.2 16-16 16s-16-7.2-16-16V64z">
                            </path>
                        </svg>
                    </button>
                    <button className="qc_tb_canvasToolBtns" id='qc_tb_toolBoxExitBtn' onClick={() => { props.updateWarning({ show: true, msg: `Your Canvas is not saved yet! Are you sure you want to exit?`, greenMsg: 'Cancel', redMsg: 'Exit', func: () => navigate(window.history.length > 1 ? -1 : '/home') }) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"></path></svg>
                    </button>
                    <button className="qc_tb_canvasToolBtns" id='qc_tb_toolBoxSaveBtn' onClick={props.saveCanvas}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"></path></svg>
                    </button>

                </div>
                <div id="qc_tb_canvasToolBox_bodySide">
                    <div id="qc_tb_canvasToolBox_drawingOption" className={`qc_tb_canvasToolBox_bodySideOptions ${toolOptions === 'pencil' ? 'active' : ''}`}>
                        <div id="qc_tb_canvasToolBox_sizeBox">
                            <div id="qc_tb_canvasToolBox_sizeCircleBox">
                                <div id="qc_tb_canvasToolBox_sizeCircle" style={{ height: `${pencilSize}px`, backgroundColor: pencilColor }}>
                                </div>
                            </div>
                            <input type="range" min={1} value={pencilSize} step={1} max={50} onChange={e => setPencilSize(e.target.value)} />
                        </div>
                        <div id="qc_tb_canvasToolBox_drawingColorBox">
                            <div id="qc_tb_canvasToolBox_drawingColorPalleteBox">
                                {colorPallete.map((color, index) => (
                                    <div key={index} className="qc_tb_canvasToolBox_colorPallete" style={{ backgroundColor: color }} onClick={() => setPencilColor(color)}>
                                    </div>
                                ))
                                }
                            </div>
                            <div id="qc_tb_canvasToolBox_drawingColorPickerBox">
                                <div id="qc_tb_canvasToolBox_eyeDropper">
                                    <button onClick={deployEyeDropper}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z" />
                                        </svg>
                                    </button>
                                </div>
                                <div ref={colorPickerRef} id="qc_tb_canvasToolBox_colorPicker"></div>
                            </div>
                        </div>
                    </div>

                    <div id="qc_tb_canvasToolBox_eraseOption" className={`qc_tb_canvasToolBox_bodySideOptions ${toolOptions === 'erase' ? 'active' : ''}`}>
                        <div id="qc_tb_canvasToolBox_sizeBox">
                            <div id="qc_tb_canvasToolBox_sizeCircleBox">
                                <div id="qc_tb_canvasToolBox_sizeCircle" style={{ height: `${eraserSize}px`, width: `${eraserSize}px`, backgroundColor: 'black' }}>
                                </div>
                            </div>
                            <input type="range" min={10} value={eraserSize} step={1} max={50} onChange={e => setEraserSize(e.target.value)} />
                        </div>
                    </div>

                    <div id="qc_tb_canvasToolBox_shapeOption" className={`qc_tb_canvasToolBox_bodySideOptions ${toolOptions === 'shape' ? 'active' : ''}`}>
                        <div id="qc_tb_canvasToolBox_shapeOption_top">
                            {shapePack.map((shape, index) => (
                                <button key={index} className='qc_tb_canvasToolBox_shapeBtn' onClick={() => { props.addShapeProp(shape); props.handleToolBoxState('move'); setIsToolBoxOpen(false); }}>
                                    <div className={`${shape}Shape`}></div>
                                </button>
                            ))}

                            {iconPack.map((icon, index) => (
                                <button key={index} className="qc_tb_canvasToolBox_shapeBtn" onClick={e => { props.addIconProp(e); props.handleToolBoxState('move'); setIsToolBoxOpen(false); }}>
                                    {icon}
                                </button>
                            ))}
                        </div>
                        <div id="qc_tb_canvasToolBox_shapeOption_bottom">
                            {customIconsInputShow ?
                                <>
                                    <textarea value={customIconsInputValue} onChange={e => setCustomIconsInputValue(e.target.value)} id="customIconsInput" autoFocus placeholder="Add an SVG element here. Any element, other than SVG, won't work."></textarea>
                                    {customIconsInputValue.trim().length > 0 ?
                                        <button id="addCustomSVG" onClick={() => handleCustomIcon(customIconsInputValue)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><path d="M290.5 51.8C283.3 39.5 270.2 32 256 32s-27.3 7.5-34.5 19.8l-216 368c-7.3 12.4-7.3 27.7-.2 40.1S25.7 480 40 480H472c14.3 0 27.6-7.7 34.7-20.1s7-27.8-.2-40.1l-216-368z"></path></svg>
                                        </button>
                                        : null
                                    }
                                </>
                                :
                                <button id="qc_tb_canvasToolBox_shapeOption_default" onClick={() => setCustomIconsInputShow(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 640 512"><path d="M405.1 .8c-8.4-2.8-17.4 1.7-20.2 10.1l-160 480c-2.8 8.4 1.7 17.4 10.1 20.2s17.4-1.7 20.2-10.1l160-480c2.8-8.4-1.7-17.4-10.1-20.2zM172 117.4c-5.9-6.6-16-7.2-22.6-1.3l-144 128C2 247.1 0 251.4 0 256s2 8.9 5.4 12l144 128c6.6 5.9 16.7 5.3 22.6-1.3s5.3-16.7-1.3-22.6L40.1 256 170.6 140c6.6-5.9 7.2-16 1.3-22.6zm296.1 0c-5.9 6.6-5.3 16.7 1.3 22.6L599.9 256 469.4 372c-6.6 5.9-7.2 16-1.3 22.6s16 7.2 22.6 1.3l144-128c3.4-3 5.4-7.4 5.4-12s-2-8.9-5.4-12l-144-128c-6.6-5.9-16.7-5.3-22.6 1.3z"></path></svg>
                                    <h4>ADD YOUR OWN ICONS</h4>
                                </button>
                            }
                        </div>
                    </div>
                </div >
            </div >
        </div >
    )
}
