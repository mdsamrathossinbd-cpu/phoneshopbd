import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYHGC44gzwdY8huAXrPnGDqqoqRjpuw60",
  authDomain: "phone-shop-b3137.firebaseapp.com",
  projectId: "phone-shop-b3137",
  storageBucket: "phone-shop-b3137.firebasestorage.app",
  messagingSenderId: "1064409815776",
  appId: "1:1064409815776:web:a256007a8465c8672e8e85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async function() {
    // Buy button click logic
    document.querySelectorAll('.btn-buy').forEach(button => {
        button.addEventListener('click', function(e){
            e.preventDefault();
            const card = this.closest('.card');
            const phoneName = card.querySelector('h4').innerText;
            const phonePrice = card.querySelector('.price').innerText;
            if(confirm(`📦 ${phoneName}\n💵 দাম: ${phonePrice}\n\nঅর্ডার করতে চান?`)){
                window.location.href = "login.html";
            }
        });
    });

    // Admin Product Add Logic
    const adminForm = document.getElementById('admin-product-form');
    if (adminForm) {
        adminForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('p-name').value;
            const price = document.getElementById('p-price').value;
            const img = document.getElementById('p-img').value;

            try {
                await addDoc(collection(db, "products"), { name, price, img });
                document.getElementById('admin-msg').innerText = 'সফলভাবে নতুন প্রোডাক্ট যোগ করা হয়েছে!';
                adminForm.reset();
            } catch (error) {
                console.error("Error adding document: ", error);
                alert('প্রোডাক্ট যোগ করতে সমস্যা হয়েছে!');
            }
        });
    }

    // Load Products on Homepage from Firebase
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            querySnapshot.forEach((doc) => {
                const prod = doc.data();
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${prod.img}" alt="${prod.name}">
                    <h4>${prod.name}</h4>
                    <div class="price">${prod.price}</div>
                    <a href="#" class="btn-buy">Buy Now</a>
                `;
                productGrid.appendChild(card);
            });
        } catch (error) {
            console.error("Error loading products: ", error);
        }
    }
});
