document.addEventListener("DOMContentLoaded", () => {
    sepetGuncelle();
    kullaniciKontrol();

    const urlParams = new URLSearchParams(window.location.search);
    const aranan = urlParams.get('ara');
    const kategori = urlParams.get('kategori');

    const aramaKutusu = document.getElementById('aramaInput');
    if (aranan && aramaKutusu) {
        aramaKutusu.value = aranan;
    }

    if (document.querySelector('.filtre-alani') && kategori) {
        let cb = document.querySelector(`.filtre-cb[value="${kategori}"]`);
        if (cb) cb.checked = true;
    }

    const sepeteEkleButonlari = document.querySelectorAll('.sepete-ekle-btn');
    sepeteEkleButonlari.forEach(buton => {
        buton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const isim = e.target.getAttribute('data-isim');
            const fiyat = parseInt(e.target.getAttribute('data-fiyat'));

            let sepet = JSON.parse(localStorage.getItem('mavi_sepet')) || [];
            sepet.push({ id, isim, fiyat });
            localStorage.setItem('mavi_sepet', JSON.stringify(sepet));

            sepetGuncelle();
            maviUyari(isim + " sepete eklendi!", "basarili");
        });
    });

    if (window.location.pathname.includes('sepetim.html')) sepetSayfasiniDoldur();
    if (window.location.pathname.includes('odeme.html')) odemeSayfasiniDoldur();

    if (document.querySelector('.filtre-alani') && aranan) {
        setTimeout(() => {
            if (typeof gelismisFiltreyiAtesle === 'function') {
                gelismisFiltreyiAtesle();
            }
        }, 100);
    }
});

function maviUyari(mesaj, tip = 'normal') {
    let container = document.getElementById('mavi-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'mavi-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `mavi-toast ${tip}`;
    
    let ikon = '';
    if(tip === 'basarili') ikon = `<svg style="width:22px;height:22px;fill:#28a745" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
    else if(tip === 'hata') ikon = `<svg style="width:22px;height:22px;fill:#cc0000" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>`;
    else ikon = `<svg style="width:22px;height:22px;fill:#0033a0" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`;

    toast.innerHTML = `<div style="display:flex;align-items:center;gap:10px;">${ikon}<span style="line-height:1.4;">${mesaj}</span></div>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('goster'), 10);
    setTimeout(() => {
        toast.classList.remove('goster');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function urunAra() {
    const aramaKutusu = document.getElementById('aramaInput');
    if (!aramaKutusu || aramaKutusu.value.trim() === "") return;
    
    const kelime = encodeURIComponent(aramaKutusu.value.trim());
    
    if (window.location.href.toLowerCase().includes('urunler')) {
        if (typeof gelismisFiltreyiAtesle === 'function') {
            gelismisFiltreyiAtesle();
        }
    } else {
        window.location.href = './urunler.html?ara=' + kelime;
    }
}

function sepetGuncelle() {
    const sepet = JSON.parse(localStorage.getItem('mavi_sepet')) || [];
    const link = document.getElementById('sepet-link');
    if (link) link.innerText = `Sepetim (${sepet.length})`;
}

function sepetSayfasiniDoldur() {
    const sepet = JSON.parse(localStorage.getItem('mavi_sepet')) || [];
    const icerik = document.getElementById('sepet-icerik');
    const tutar = document.getElementById('toplam-tutar');
    let toplam = 0;
    if (!icerik) return;
    icerik.innerHTML = '';

    if (sepet.length === 0) {
        icerik.innerHTML = '<p style="color: #666;">Sepetinizde ürün bulunmamaktadır.</p>';
    } else {
        sepet.forEach((u) => {
            toplam += u.fiyat;
            icerik.innerHTML += `<div style="padding:15px; border-bottom:1px solid #ddd; display:flex; justify-content:space-between; align-items:center;"><p><strong>${u.isim}</strong></p><p style="color: #0033a0; font-weight: bold;">${u.fiyat} TL</p></div>`;
        });
    }
    if (tutar) tutar.innerText = toplam;
}

function odemeSayfasiniDoldur() {
    const sepet = JSON.parse(localStorage.getItem('mavi_sepet')) || [];
    const ozet = document.getElementById('odeme-siparis-ozeti');
    const odemeToplam = document.getElementById('odeme-toplam');
    let toplam = 0;
    if (!ozet) return;
    ozet.innerHTML = '';

    if (sepet.length === 0) {
        ozet.innerHTML = '<p>Sepetiniz boş. Lütfen ürün ekleyin.</p>';
        setTimeout(() => window.location.href = "urunler.html", 2000);
    } else {
        sepet.forEach((urun) => {
            toplam += urun.fiyat;
            ozet.innerHTML += `<p style="margin-bottom: 5px; border-bottom: 1px solid #ccc; padding-bottom: 5px; display:flex; justify-content:space-between;"><span>${urun.isim}</span> <strong>${urun.fiyat} TL</strong></p>`;
        });
    }
    if (odemeToplam) odemeToplam.innerText = toplam;

    const form = document.getElementById('odemeFormu');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            maviUyari('Ödemeniz başarıyla alındı! Siparişiniz hazırlanıyor.', 'basarili');
            localStorage.removeItem('mavi_sepet');
            setTimeout(() => { window.location.href = "index.html"; }, 2500);
        });
    }
}

function sepetiTemizle() { 
    localStorage.removeItem('mavi_sepet'); 
    sepetSayfasiniDoldur(); 
    sepetGuncelle(); 
}

function sepetiOnayla() { 
    if(JSON.parse(localStorage.getItem('mavi_sepet')||"[]").length > 0) {
        window.location.href = "odeme.html";
    } else {
        maviUyari("Sipariş verebilmek için sepetinize ürün ekleyin.", "hata"); 
    }
}

function kaydir(id, mik) { 
    const el = document.getElementById(id);
    if(el) el.scrollBy({ left: mik, behavior: 'smooth' }); 
}

function kullaniciKontrol() {
    const aktif = localStorage.getItem('mavi_aktif_kullanici');
    const link = document.getElementById('kullanici-link');
    if(aktif && link) {
        link.innerText = "Hoş Geldin, " + aktif;
        link.href = "#";
        link.onclick = (e) => { 
            e.preventDefault();
            if(confirm("Çıkış yapmak istiyor musunuz?")) { 
                localStorage.removeItem('mavi_aktif_kullanici'); 
                window.location.reload(); 
            }
        };
    }
}
