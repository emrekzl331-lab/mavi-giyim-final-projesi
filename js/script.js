document.addEventListener("DOMContentLoaded", () => {
    sepetGuncelle();
    kullaniciKontrol();

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
            alert(isim + " sepete eklendi!");
        });
    });

    if (window.location.pathname.includes('sepetim.html')) sepetSayfasiniDoldur();
    if (window.location.pathname.includes('odeme.html')) odemeSayfasiniDoldur();

    const urlParams = new URLSearchParams(window.location.search);
    const aranan = urlParams.get('ara');
    const kategori = urlParams.get('kategori');

    if (document.querySelector('.filtre-alani')) {
        const urunler = document.querySelectorAll('.filter-item');
        if (kategori) {
            let cb = document.querySelector(`.filtre-cb[value="${kategori}"]`);
            if (cb) cb.checked = true;
        }
        
        function urunleriFiltrele() {
            let seciliKategoriler = Array.from(document.querySelectorAll('input[data-tip="kategori"]:checked')).map(cb => cb.value);
            let maksFiyat = parseInt(document.getElementById('fiyat-araligi').value);
            document.getElementById('fiyat-gosterge').innerText = maksFiyat;
            
            let aramaMetni = document.getElementById('aramaInput') ? document.getElementById('aramaInput').value.toLowerCase() : "";
            if(aranan && aramaMetni === "") aramaMetni = aranan.toLowerCase();

            let gosterilenSayi = 0;
            urunler.forEach(urun => {
                let uKategori = urun.getAttribute('data-kategori');
                let uFiyat = parseInt(urun.getAttribute('data-fiyat'));
                let uIsim = urun.querySelector('h3').innerText.toLowerCase();

                let kategoriUyar = seciliKategoriler.length === 0 || seciliKategoriler.includes(uKategori);
                let fiyatUyar = uFiyat <= maksFiyat;
                let aramaUyar = uIsim.includes(aramaMetni);

                if(kategoriUyar && fiyatUyar && aramaUyar) {
                    urun.style.display = 'block';
                    gosterilenSayi++;
                } else {
                    urun.style.display = 'none';
                }
            });
            document.getElementById('hata-mesaji').style.display = (gosterilenSayi === 0) ? 'block' : 'none';
        }

        document.getElementById('fiyat-araligi').addEventListener('input', urunleriFiltrele);
        document.querySelectorAll('.filtre-cb').forEach(cb => cb.addEventListener('change', urunleriFiltrele));
        urunleriFiltrele();
    }
});

function urunAra() {
    const kelime = document.getElementById('aramaInput').value;
    if (window.location.pathname.includes('ürünler.html')) {
        document.getElementById('fiyat-araligi').dispatchEvent(new Event('input'));
    } else {
        window.location.href = 'ürünler.html?ara=' + kelime;
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
    ozet.innerHTML = '';

    if (sepet.length === 0) {
        ozet.innerHTML = '<p>Sepetiniz boş. Lütfen ürün ekleyin.</p>';
        setTimeout(() => window.location.href = "ürünler.html", 2000);
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
            alert('Ödemeniz başarıyla alındı! Siparişiniz hazırlanıyor.');
            localStorage.removeItem('mavi_sepet');
            window.location.href = "index.html";
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
        alert("Sipariş verebilmek için sepetinize ürün ekleyin."); 
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
        link.onclick = () => { 
            if(confirm("Çıkış yapmak istiyor musunuz?")) { 
                localStorage.removeItem('mavi_aktif_kullanici'); 
                window.location.reload(); 
            }
        };
    }
}
