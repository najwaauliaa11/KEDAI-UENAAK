var namaMenu = [
    "Nasi Sayur Lodeh",
    "Nasi Ayam Geprek",
    "Nasi Goreng Telur",
    "Indomie Rebus + Telur + Teh Es",
    "Indomie Goreng + Telur + Teh Es",
    "Rice Bowl Ayam Suwir Kemangi",
    "Rice Bowl Tongkol Suwir",
    "Rice Bowl Ayam Teriyaki",
    "Soto Ayam + Telur + Teh Es",
    "Rice Bowl Bakso Sapi Sambalado",
    "Kopi",
    "Kopi Susu",
    "Milo",
    "Es Teh Jumbo",
    "Es Jeruk Kecil",
    "Es Jeruk Besar",
    "Mineral Botol",
    "Air Putih Es"
];

var hargaMenu = [
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    6000,
    8000,
    6000,
    3000,
    4000,
    5000,
    4000,
    2000
];

var pesananBaru = null;
var daftarPesanan = [];
var nomorTerakhir = 0;

function rupiah(angka) {
    return "Rp" + angka.toLocaleString("id-ID") + ",-";
}

function tambahTulisan(tempat, tulisan) {
    var paragraf = document.createElement("p");

    paragraf.textContent = tulisan;

    tempat.appendChild(paragraf);
}

function pilihJenisPesanan() {
    var jenis = document.getElementById("jenis").value;
    var bagianAlamat = document.getElementById("bagianAlamat");
    var alamat = document.getElementById("alamat");

    if (jenis == "Diantar") {
        bagianAlamat.hidden = false;
        alamat.required = true;
    } else {
        bagianAlamat.hidden = true;
        alamat.required = false;
        alamat.value = "";
    }
}

function hapusIsian() {
    document.getElementById("formPesanan").reset();

    pesananBaru = null;

    pilihJenisPesanan();
}

function bacaRiwayat() {
    try {
        var dataLama = localStorage.getItem("riwayatUenaak");

        if (dataLama != null) {
            var hasil = JSON.parse(dataLama);

            if (Array.isArray(hasil)) {
                daftarPesanan = hasil;
            }
        }

        var nomorLama = Number(
            localStorage.getItem("nomorTerakhirUenaak")
        );

        if (nomorLama > 0) {
            nomorTerakhir = nomorLama;
        }

        for (var i = 0; i < daftarPesanan.length; i++) {
            if (daftarPesanan[i].nomor > nomorTerakhir) {
                nomorTerakhir = daftarPesanan[i].nomor;
            }
        }
    } catch (error) {
        document.getElementById("infoPenyimpanan").textContent =
            "Riwayat tersimpan tidak dapat dibaca. " +
            "Pesanan baru tetap bisa dibuat.";
    }
}

function simpanRiwayat() {
    try {
        localStorage.setItem(
            "riwayatUenaak",
            JSON.stringify(daftarPesanan)
        );

        localStorage.setItem(
            "nomorTerakhirUenaak",
            nomorTerakhir
        );

        document.getElementById("infoPenyimpanan").textContent =
            "Riwayat tersimpan pada browser ini.";
    } catch (error) {
        document.getElementById("infoPenyimpanan").textContent =
            "Browser tidak dapat menyimpan riwayat. " +
            "Pesanan hanya tersedia selama halaman ini terbuka.";
    }
}

function buatPesanan() {
    var nama = document.getElementById("nama").value.trim();
    var telepon = document.getElementById("telepon").value.trim();
    var jenis = document.getElementById("jenis").value;
    var alamat = document.getElementById("alamat").value.trim();
    var catatan = document.getElementById("catatan").value.trim();

    if (nama == "" || telepon == "") {
        alert("Isi nama dan nomor telepon terlebih dahulu.");
        return;
    }

    if (jenis == "Diantar" && alamat == "") {
        alert("Isi alamat pengantaran terlebih dahulu.");
        document.getElementById("alamat").focus();
        return;
    }

    if (jenis != "Diantar") {
        alamat = "";
    }

    var detail = [];
    var total = 0;
    for (var i = 0; i < namaMenu.length; i++) {
        var jumlah = Number(
            document.getElementById("jumlah" + i).value
        );

        if (!Number.isInteger(jumlah) || jumlah < 0) {
            alert("Jumlah pesanan harus berupa angka bulat 0 atau lebih.");
            return;
        }

        if (jumlah > 0) {
            var subtotal = jumlah * hargaMenu[i];

            detail.push(
                jumlah + " x " + namaMenu[i] +
                " = " + rupiah(subtotal)
            );

            total = total + subtotal;
        }
    }

    if (detail.length == 0) {
        alert("Pilih minimal satu makanan atau minuman.");
        return;
    }

    pesananBaru = {
        nama: nama,
        telepon: telepon,
        jenis: jenis,
        alamat: alamat,
        catatan: catatan,
        detail: detail,
        total: total
    };

    var ringkasan = document.getElementById("ringkasan");

    ringkasan.textContent = "";

    tambahTulisan(ringkasan, "Nama: " + nama);
    tambahTulisan(ringkasan, "Telepon: " + telepon);
    tambahTulisan(ringkasan, "Jenis pesanan: " + jenis);

    if (jenis == "Diantar") {
        tambahTulisan(ringkasan, "Alamat: " + alamat);

        tambahTulisan(
            ringkasan,
            "Ongkos antar belum termasuk. " +
            "Konfirmasikan ongkos antar kepada kedai."
        );
    }

    for (var i = 0; i < detail.length; i++) {
        tambahTulisan(ringkasan, detail[i]);
    }

    if (catatan != "") {
        tambahTulisan(ringkasan, "Catatan: " + catatan);
    }

    document.getElementById("totalPembayaran").textContent =
        "TOTAL MENU: " + rupiah(total);

    document.getElementById("formPesanan").hidden = true;
    document.getElementById("pembayaran").hidden = false;

    document.getElementById("pembayaran").scrollIntoView();
}

function ubahPesanan() {
    pesananBaru = null;

    document.getElementById("pembayaran").hidden = true;
    document.getElementById("formPesanan").hidden = false;

    pilihJenisPesanan();

    document.getElementById("formPesanan").scrollIntoView();
}

function konfirmasiPembayaran() {
    if (pesananBaru == null) {
        return;
    }

    var yakin = confirm(
        "Apakah kamu sudah membayar sesuai total menu?"
    );

    if (yakin == false) {
        return;
    }

    nomorTerakhir = nomorTerakhir + 1;

    pesananBaru.nomor = nomorTerakhir;

    pesananBaru.status =
        "Pembayaran dikonfirmasi pemesan, " +
        "menunggu pemeriksaan kedai.";

    daftarPesanan.push(pesananBaru);

    pesananBaru = null;

    document.getElementById("pembayaran").hidden = true;
    document.getElementById("formPesanan").hidden = false;

    hapusIsian();

    tampilkanPesanan();

    document.getElementById("daftarPesanan").scrollIntoView();

    alert(
        "Pesanan " + nomorTerakhir +
        " sudah dicatat. Pembayaran akan diperiksa oleh kedai."
    );
}

function tampilkanPesanan() {
    var tempat = document.getElementById("daftarPesanan");

    tempat.textContent = "";

    if (daftarPesanan.length == 0) {
        tambahTulisan(tempat, "Belum ada pesanan.");
        return;
    }

    for (var i = 0; i < daftarPesanan.length; i++) {
        var pesanan = daftarPesanan[i];

        var kartu = document.createElement("div");
        kartu.className = "kartu-pesanan";

        var judul = document.createElement("h3");
        judul.textContent = "Pesanan " + pesanan.nomor;

        kartu.appendChild(judul);

        tambahTulisan(kartu, "Nama: " + pesanan.nama);
        tambahTulisan(kartu, "Telepon: " + pesanan.telepon);
        tambahTulisan(kartu, "Jenis pesanan: " + pesanan.jenis);

        if (pesanan.jenis == "Diantar") {
            if (pesanan.alamat) {
                tambahTulisan(
                    kartu,
                    "Alamat: " + pesanan.alamat
                );
            }

            tambahTulisan(
                kartu,
                "Ongkos antar belum termasuk dalam total menu."
            );
        }

        for (var j = 0; j < pesanan.detail.length; j++) {
            tambahTulisan(kartu, pesanan.detail[j]);
        }

        if (pesanan.catatan) {
            tambahTulisan(
                kartu,
                "Catatan: " + pesanan.catatan
            );
        }

        tambahTulisan(
            kartu,
            "Total menu: " + rupiah(pesanan.total)
        );

        tambahTulisan(
            kartu,
            "Status: " + pesanan.status
        );

        tempat.appendChild(kartu);
    }
}

pilihJenisPesanan();
tampilkanPesanan();