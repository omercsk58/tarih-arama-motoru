let sayacInterval;
let devletler = [];

fetch("data.json")
    .then(response => response.json())
    .then(data => {
        devletler = data;
    });

function arama() {
    let input = document.getElementById("search").value.toLowerCase().trim();

    if (input === "") {
        document.getElementById("sonuc").innerHTML =
            "Lütfen bir devlet adı gir.";
        return;
    }

    let sonucDiv = document.getElementById("sonuc");

    let bulunan = devletler.find(d =>
        d.isim.toLowerCase().includes(input)
    );

    if (bulunan) {
        sonucDiv.innerHTML = `
            <h2>${bulunan.isim}</h2>

            <p>Kuruluş: ${bulunan.kurulus}</p>

            <p>Yıkılış: ${bulunan.yikilis}</p>

            <p>
            Durum:
            ${
                bulunan.yikilis === "devam"
                ? "🟢 Aktif"
                : "🔴 Yıkılmış"
            }
            </p>

            <p id="sayac"></p>
        `;

        sayacBaslat(bulunan.yikilis);
        timelineOlustur(bulunan);setTimeout(() => {

    let container =
        document.getElementById(
            "timeline-container"
        );

    let bitis =
        secilenDevlet.yikilis === "devam"
        ? bugun
        : Number(secilenDevlet.yikilis);

    let orta =
        (
            (
                Number(secilenDevlet.kurulus)
                +
                bitis
            ) / 2
            -
            baslangicYili
        )
        * olcek
        + 220;

    container.scrollLeft =
        orta
        -
        container.clientWidth / 2;

}, 50);
        onerileriGoster(bulunan);

    } else {
        sonucDiv.innerHTML =
            "Bu isimde bir devlet bulunamadı.";
    }
}

function sayacBaslat(yikilisYili) {

    clearInterval(sayacInterval);

    sayacInterval = setInterval(() => {

        if (yikilisYili === "devam") {
            document.getElementById("sayac").innerText =
                "Bu devlet günümüzde hâlâ devam ediyor.";
            return;
        }

        let simdi = new Date().getFullYear();

        let yil;

        if (Number(yikilisYili) < 0) {
            yil = simdi + Math.abs(Number(yikilisYili));
        } else {
            yil = simdi - Number(yikilisYili);
        }

        document.getElementById("sayac").innerText =
            `Yıkılışından bu yana geçen süre: ${yil} yıl`;

    }, 1000);
}

function timelineOlustur(secilenDevlet) {

    let timeline =
        document.getElementById("timeline");

    let cetvel =
        document.getElementById("yil-cetveli");

    timeline.innerHTML = "";
    cetvel.innerHTML = "";

    const baslangicYili = -4500;
    const bugun = new Date().getFullYear();
    const olcek = 2;

    for (
        let yil = -4500;
        yil <= bugun;
        yil += 100
    ) {

        let x =
            (yil - baslangicYili)
            * olcek;

        cetvel.innerHTML += `
<div
class="yil"
style="left:${x + 220}px"
>
${yil}

<div class="yil-cizgisi"></div>

</div>
`;
    }

    devletler.forEach(devlet => {

        let bitisYili =
            devlet.yikilis === "devam"
            ? bugun
            : Number(devlet.yikilis);

        let secilenBitis =
            secilenDevlet.yikilis === "devam"
            ? bugun
            : Number(secilenDevlet.yikilis);

        if (
            Number(devlet.kurulus)
            <= secilenBitis

            &&

            bitisYili
            >= Number(secilenDevlet.kurulus)
        ) {

            let left =
                (
                    Number(devlet.kurulus)
                    - baslangicYili
                )
                * olcek;

            let width =
                (
                    bitisYili
                    - Number(devlet.kurulus)
                )
                * olcek;

            if (width < 5) {
                width = 5;
            }

timeline.innerHTML += `
<div class="timeline-satir">

<div
class="devlet-cizgi"
style="
left:${left + 220}px;
width:${width}px;
background:${
    devlet.isim === secilenDevlet.isim
    ? "deepskyblue"
    : (
        devlet.yikilis === "devam"
        ? "limegreen"
        : "gold"
    )
};
box-shadow:${
    devlet.isim === secilenDevlet.isim
    ? "0 0 15px deepskyblue"
    : "none"
};
">
</div>

<div
class="timeline-yazi"
style="
left:${left + width + 235}px;
">
${devlet.isim}
</div>

</div>
`;
        }
    });
}

function onerileriGoster(secilenDevlet) {

    let liste =
        document.getElementById(
            "oneriler-listesi"
        );

    liste.innerHTML = "";

    let ayniDonemdekiler =
        devletler.filter(devlet => {

            let bitis =
                devlet.yikilis === "devam"
                ? new Date().getFullYear()
                : Number(devlet.yikilis);

            let secilenBitis =
                secilenDevlet.yikilis === "devam"
                ? new Date().getFullYear()
                : Number(secilenDevlet.yikilis);

            return (

                devlet.isim
                !==
                secilenDevlet.isim

                &&

                Number(devlet.kurulus)
                <= secilenBitis

                &&

                bitis
                >=
                Number(
                    secilenDevlet.kurulus
                )
            );
        });

    ayniDonemdekiler
        .slice(0, 3)
        .forEach(devlet => {

            liste.innerHTML += `
                <div
                    class="oneri-kart"
                    onclick="
                        otomatikAra(
                            '${devlet.isim}'
                        )
                    "
                >

                    <h3>
                        ${devlet.isim}
                    </h3>

                    <p>
                        ${devlet.kurulus}
                        -
                        ${devlet.yikilis}
                    </p>

                </div>
            `;
        });
}

function otomatikAra(isim) {
    document.getElementById("search").value =
        isim;

    arama();
}
document.addEventListener("keydown", function (e) {

    let container =
        document.getElementById(
            "timeline-container"
        );

    if (e.key === "ArrowRight") {
        container.scrollLeft += 100;
    }

    if (e.key === "ArrowLeft") {
        container.scrollLeft -= 100;
    }
});
ortalaTimeline(bulunan);
function ortalaTimeline(devlet) {

    const baslangicYili = -4500;
    const bugun = new Date().getFullYear();
    const olcek = 2;

    let bitis =
        devlet.yikilis === "devam"
        ? bugun
        : Number(devlet.yikilis);

    let ortaX =
        (
            (
                Number(devlet.kurulus) +
                bitis
            ) / 2
            - baslangicYili
        ) * olcek + 220;

    let container =
        document.getElementById(
            "timeline-container"
        );

    container.scrollLeft =
        ortaX -
        container.clientWidth / 2;
}