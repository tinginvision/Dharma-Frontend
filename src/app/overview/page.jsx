import Image from "next/image";

import { buildPageMetadata } from "@/lib/siteMetadata";

export const metadata = buildPageMetadata({
  title: "Overview",
  path: "/overview",
});

export default function OverviewPage() {
  return (
    <section className="overview-page">
      <div className="abt-banner">
        <div className="container overview-page__container">
          <div className="row">
            <div className="col-md-12">
              <div className="head-title text-center top-pad-abt">
                <h1 className="color-white f120 text-up font-hammersmith">
                  about us
                </h1>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="main-about-sec">
                <div className="movie-inside-curve" id="top-scroll" />
                <div className="movie-inner-bg">
                  <div className="m-min-tp">
                    <div className="text-center pt20 overview-taglines">
                      <h1 className="color-primary font-bold text-up margin0">
                        Heart-warming storylines...
                      </h1>
                      <h1 className="color-primary font-bold text-up margin0">
                        Stellar megastar casts...
                      </h1>
                      <h1 className="color-primary font-bold text-up margin0">
                        Record box-office collections...
                      </h1>
                    </div>
                    <div className="data-abt mt20 movie-inside-date pb30">
                      <p>
                        Dharma Productions is a leading Indian film studio,
                        production house and distribution company. Owned by Karan
                        Johar, and Adar Poonawalla, the company was founded by Late
                        Sri Yash Johar in 1976, with its first production venture
                        titled &apos;Dostana&apos; starring Amitabh Bachchan. Since
                        Karan Johar&apos;s directorial debut film &apos;Kuch Kuch Hota
                        Hai&apos;, the company has gone on to produce more than 60+
                        films which includes series of blockbusters and critically
                        acclaimed films like Kabhi Khushi Kabhie Gham, My Name is Khan,
                        Yeh Jawaani Hai Deewani, Agneepath, The Lunchbox, Baahubali,
                        Raazi, Kesari, Shershaah, Rocky Aur Rani Kii Prem Kahaani,
                        Kesari Chapter 2 and Homebound - a 98th Oscar shortlisted
                        film. In its recent past, Dharma Productions has earned a name
                        in the industry for launching a fresh talent pool of 23+
                        directors, together with rising stars such as Alia Bhatt,
                        Sidharth Malhotra, Varun Dhawan, Janhvi Kapoor, Ananya Panday
                        &amp; Lakshya.
                      </p>
                      <p>
                        Today, Dharma Productions is constantly aiming at creating new
                        benchmarks in the Indian film industry.
                      </p>
                    </div>
                    <div className="karan-img dh-relative pb30">
                      <Image
                        src="/frontend/img/m1.jpg"
                        alt="Dharma Productions"
                        width={1511}
                        height={797}
                        className="img-responsive"
                        sizes="(max-width: 768px) 100vw, 1140px"
                      />
                      <div className="movie-inside-date top-min">
                        <div className="mn-org">
                          <div className="text-center">
                            <h1 className="margin0 font-bold color-white">
                              KARAN JOHAR
                            </h1>
                            <h4 className="margin0 font-bold color-white text-up">
                              many hats, one head.
                            </h4>
                          </div>
                          <p className="color-white f18 mt15 f14-min">
                            Producer, Director &amp; Talk show host, Karan
                            Johar is one of the most notable Indian Filmmakers,
                            who has brought a fresh &amp; modern outlook to
                            Indian Commercial Cinema.
                          </p>
                        </div>
                        <div className="overview-page__karan-below-mn-org pt20">
                          <p>
                            Producer, director, talk show host and an entrepreneur -
                            Karan Johar is one of the most notable Indian filmmakers
                            for the past 25+ years with the honor of being a Padma
                            Shri awardee.
                          </p>
                          <p>
                            His talk show &apos;Koffee With Karan&apos; has the
                            distinction of being the most watched English talk show
                            on Indian television and is now ruling over the OTT space
                            as well. He&apos;s also the host for the Indian
                            adaptation of the successful reality game show - The
                            Traitors.
                          </p>
                          <p>
                            Directors have flourished under his guidance and support
                            as a producer, releasing both commercial blockbusters
                            like Agneepath, Dostana and Yeh Jawaani Hai Deewani,
                            Shershaah (a national award winning film) &amp; the
                            blockbuster, Brahmastra - as well as critical successes
                            like Wake Up Sid, Kapoor &amp; Sons, Gehraiyaan and
                            recently, the Cannes Film Festival, TIFF nominated along
                            with the official entry from India for the Best
                            International Feature at the 98th Academy Awards film -
                            Homebound. Marking his 25th anniversary year as a
                            director, he released his directorial &apos;Rocky Aur
                            Rani Kii Prem Kahaani&apos; for which he has won a
                            National Film Award for the most popular film providing
                            wholesome entertainment. He also successfully built three
                            branches of the Dharma empire - Dharmatic Entertainment,
                            Dharma 2.0 and Dharma Collab Artists Agency.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
