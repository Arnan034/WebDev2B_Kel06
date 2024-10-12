// import React, { useState, useRef, useEffect } from "react";

// const Genre = () => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [buttonWidths, setButtonWidths] = useState([]);
//     const categoryInnerRef = useRef(null);

//     // Mengambil lebar setiap tombol secara dinamis
//     const calculateButtonWidths = () => {
//         const buttons = document.querySelectorAll('.category-button');
//         const widths = Array.from(buttons).map(button => button.getBoundingClientRect().width);
//         setButtonWidths(widths);
//     };

//     const showSlide = (index) => {
//         const totalButtons = buttonWidths.length;
//         const maxIndex = totalButtons - visibleButtons();

//         let newIndex = index;

//         if (index > maxIndex) {
//             newIndex = 0;
//         } else if (index < 0) {
//             newIndex = maxIndex;
//         }

//         setCurrentIndex(newIndex);
//     };

//     const visibleButtons = () => {
//         let totalWidth = 0;
//         let count = 0;

//         // Hitung berapa banyak tombol yang bisa muat dalam container berdasarkan lebar
//         for (let width of buttonWidths) {
//             totalWidth += width;
//             if (totalWidth <= 500) { // Asumsikan lebar container adalah 500px
//                 count++;
//             } else {
//                 break;
//             }
//         }
//         return count;
//     };

//     const updateSlidePosition = () => {
//         const offset = buttonWidths.slice(0, currentIndex).reduce((acc, width) => acc + width + 10, 0);
//         if (categoryInnerRef.current) {
//             categoryInnerRef.current.style.transform = `translateX(-${offset}px)`;
//         }
//     };

//     const nextSlide = () => {
//         showSlide(currentIndex + 1);
//     };

//     const prevSlide = () => {
//         showSlide(currentIndex - 1);
//     };

//     useEffect(() => {
//         calculateButtonWidths();
//     }, []);

//     useEffect(() => {
//         updateSlidePosition();
//     }, [currentIndex, buttonWidths]);

//     return (
//         <div>
//             <div className="category-container">
//                 <button className="category-control-prev" onClick={prevSlide}>
//                     <i className="fa-solid fa-angle-left"></i>
//                 </button>
//                 <div className="category-wrapper">
//                     <div className="button-category">
//                         <div className="category-inner" ref={categoryInnerRef}>
//                             {Array.from({ length: 20 }, (_, index) => (
//                                 <button key={index} className="category-button">
//                                     Genre {index + 1}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//                 <button className="category-control-next" onClick={nextSlide}>
//                     <i className="fa-solid fa-angle-right"></i>
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Genre;
