export const prevAll = (element: HTMLDivElement): HTMLDivElement[] => {
    const result: HTMLDivElement[] = [];

    while ((element = element.previousElementSibling as HTMLDivElement)) result.push(element);
    return result;
};

export interface IData {
    [key: string | number]: IDataEntry[];
}

export interface IDataEntry {
    AGS: number;
    municipality: string;
    municipality_short: string;
    total: number;
    date: string;
    living: number;
    living_percent: number;
    industry: number;
    industry_percent: number;
    misc_industry_living: number;
    misc_industry_living_percent: number;
    transport_infrastructure: number;
    transport_infrastructure_percent: number;
    nature: number;
    nature_percent: number;
    water: number;
    water_percent: number;
    mining: number;
    mining_percent: number;
    used_area: number;
    used_area_percent: number;
    demographic: number;
}

export const districts = [
    "Bayern",
    "Mittelfranken",
    "Niederbayern",
    "Oberbayern",
    "Oberfranken",
    "Oberpfalz",
    "Schwaben",
    "Unterfranken",
];

export const years = [1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020];

export const longNameMap = new Map();
longNameMap.set("München St.", "München, Landeshauptstadt");
longNameMap.set("Berchtesgadener Land Lkr.", "Berchtesgadener Land (Lkr)");
longNameMap.set("Bad Tölz-W. Lkr.", "Bad Tölz-Wolfratshausen (Lkr)");
longNameMap.set("Fürstenfeldbruck Lkr.", "Fürstenfeldbruck (Lkr)");
longNameMap.set("Garmisch-Partenk. Lkr.", "Garmisch-Partenkirchen (Lkr)");
longNameMap.set("Landsberg a.Lech Lkr.", "Landsberg am Lech (Lkr)");
longNameMap.set("Mühldorf a.Inn Lkr.", "Mühldorf a.Inn (Lkr)");
longNameMap.set("Neuburg-Schrobenh. Lkr.", "Neuburg-Schrobenhausen (Lkr)");
longNameMap.set("Pfaffenh. a.d.Ilm Lkr.", "Pfaffenhofen a.d.Ilm (Lkr)");
longNameMap.set("Weilheim-Schongau Lkr.", "Weilheim-Schongau (Lkr)");
longNameMap.set("Freyung-Grafenau Lkr.", "Freyung-Grafenau (Lkr)");
longNameMap.set("Straubing-Bogen Lkr.", "Straubing-Bogen (Lkr)");
longNameMap.set("Dingolfing-Landau Lkr.", "Dingolfing-Landau (Lkr)");
longNameMap.set("Weiden i.d.OPf. St.", "Weiden i.d.OPf. (Krfr.St)");
longNameMap.set("Amberg-Sulzbach Lkr.", "Amberg-Sulzbach (Lkr)");
longNameMap.set("Neumarkt i.d.OPf.", "Neumarkt i.d.OPf. (Lkr)");
longNameMap.set("Neustadt a.d.W. Lkr.", "Neustadt a.d.Waldnaab (Lkr)");
longNameMap.set("Tirschenreuth Lkr.", "Tirschenreuth (Lkr)");
longNameMap.set("Wunsiedel i.Fichtel. Lkr.", "Wunsiedel i.Fichtelgebirge (Lkr)");
longNameMap.set("Erlangen-Höchstadt Lkr.", "Erlangen-Höchstadt (Lkr)");
longNameMap.set("Nürnberger Land Lkr.", "Nürnberger Land (Lkr)");
longNameMap.set("Neustadt a.d.A.-B.W. Lkr.", "Neustadt a.d.Aisch-Bad Windsheim (Lkr)");
longNameMap.set("Weißenburg-Gunzenh. Lkr.", "Weißenburg-Gunzenhausen (Lkr)");
longNameMap.set("Aschaffenburg St.", "Aschaffenburg (Krfr.St)");
longNameMap.set("Aschaffenburg Lkr.", "Aschaffenburg (Lkr)");
longNameMap.set("Bad Kissingen Lkr.", "Bad Kissingen (Lkr)");
longNameMap.set("Rhön-Grabfeld Lkr.", "Rhön-Grabfeld (Lkr)");
longNameMap.set("Main-Spessart Lkr.", "Main-Spessart (Lkr)");
longNameMap.set("Kempten (Allgäu) St.", "Kempten (Allgäu) (Krfr.St)");
longNameMap.set("Aichach-Friedberg Lkr.", "Aichach-Friedberg (Lkr)");
longNameMap.set("Dillingen a.d.Donau Lkr.", "Dillingen a.d.Donau (Lkr)");
longNameMap.set("Lindau (Bodensee) Lkr.", "Lindau (Bodensee) (Lkr)");
longNameMap.set("Bayern", "Bayern");
longNameMap.set("Oberbayern", "Oberbayern");
longNameMap.set("Ingolstadt St.", "Ingolstadt (Krfr.St)");
longNameMap.set("Rosenheim St.", "Rosenheim (Krfr.St)");
longNameMap.set("Altötting Lkr.", "Altötting (Lkr)");
longNameMap.set("Dachau Lkr.", "Dachau (Lkr)");
longNameMap.set("Ebersberg Lkr.", "Ebersberg (Lkr)");
longNameMap.set("Eichstätt Lkr.", "Eichstätt (Lkr)");
longNameMap.set("Erding Lkr.", "Erding (Lkr)");
longNameMap.set("Freising Lkr.", "Freising (Lkr)");
longNameMap.set("Miesbach Lkr.", "Miesbach (Lkr)");
longNameMap.set("München Lkr.", "München (Lkr)");
longNameMap.set("Rosenheim Lkr.", "Rosenheim (Lkr)");
longNameMap.set("Starnberg Lkr.", "Starnberg (Lkr)");
longNameMap.set("Traunstein Lkr.", "Traunstein (Lkr)");
longNameMap.set("Niederbayern", "Niederbayern");
longNameMap.set("Landshut St.", "Landshut (Krfr.St)");
longNameMap.set("Passau St.", "Passau (Krfr.St)");
longNameMap.set("Straubing St.", "Straubing (Krfr.St)");
longNameMap.set("Deggendorf Lkr.", "Deggendorf (Lkr)");
longNameMap.set("Kelheim Lkr.", "Kelheim (Lkr)");
longNameMap.set("Landshut Lkr.", "Landshut (Lkr)");
longNameMap.set("Passau Lkr.", "Passau (Lkr)");
longNameMap.set("Regen Lkr.", "Regen (Lkr)");
longNameMap.set("Rottal-Inn Lkr.", "Rottal-Inn (Lkr)");
longNameMap.set("Oberpfalz", "Oberpfalz");
longNameMap.set("Amberg St.", "Amberg (Krfr.St)");
longNameMap.set("Regensburg St.", "Regensburg (Krfr.St)");
longNameMap.set("Cham Lkr.", "Cham (Lkr)");
longNameMap.set("Regensburg Lkr.", "Regensburg (Lkr)");
longNameMap.set("Schwandorf Lkr.", "Schwandorf (Lkr)");
longNameMap.set("Oberfranken", "Oberfranken");
longNameMap.set("Bamberg St.", "Bamberg (Krfr.St)");
longNameMap.set("Bayreuth St.", "Bayreuth (Krfr.St)");
longNameMap.set("Coburg St.", "Coburg (Krfr.St)");
longNameMap.set("Hof St.", "Hof (Krfr.St)");
longNameMap.set("Bamberg Lkr.", "Bamberg (Lkr)");
longNameMap.set("Bayreuth Lkr.", "Bayreuth (Lkr)");
longNameMap.set("Coburg Lkr.", "Coburg (Lkr)");
longNameMap.set("Forchheim Lkr.", "Forchheim (Lkr)");
longNameMap.set("Hof Lkr.", "Hof (Lkr)");
longNameMap.set("Kronach Lkr.", "Kronach (Lkr)");
longNameMap.set("Kulmbach Lkr.", "Kulmbach (Lkr)");
longNameMap.set("Lichtenfels Lkr.", "Lichtenfels (Lkr)");
longNameMap.set("Mittelfranken", "Mittelfranken");
longNameMap.set("Ansbach St.", "Ansbach (Krfr.St)");
longNameMap.set("Erlangen St.", "Erlangen (Krfr.St)");
longNameMap.set("Fürth St.", "Fürth (Krfr.St)");
longNameMap.set("Nürnberg St.", "Nürnberg (Krfr.St)");
longNameMap.set("Schwabach St.", "Schwabach (Krfr.St)");
longNameMap.set("Ansbach Lkr.", "Ansbach (Lkr)");
longNameMap.set("Fürth Lkr.", "Fürth (Lkr)");
longNameMap.set("Roth Lkr.", "Roth (Lkr)");
longNameMap.set("Unterfranken", "Unterfranken");
longNameMap.set("Schweinfurt St.", "Schweinfurt (Krfr.St)");
longNameMap.set("Würzburg St.", "Würzburg (Krfr.St)");
longNameMap.set("Haßberge Lkr.", "Haßberge (Lkr)");
longNameMap.set("Kitzingen Lkr.", "Kitzingen (Lkr)");
longNameMap.set("Miltenberg Lkr.", "Miltenberg (Lkr)");
longNameMap.set("Schweinfurt Lkr.", "Schweinfurt (Lkr)");
longNameMap.set("Würzburg Lkr.", "Würzburg (Lkr)");
longNameMap.set("Schwaben", "Schwaben");
longNameMap.set("Augsburg St.", "Augsburg (Krfr.St)");
longNameMap.set("Kaufbeuren St.", "Kaufbeuren (Krfr.St)");
longNameMap.set("Memmingen St.", "Memmingen (Krfr.St)");
longNameMap.set("Augsburg Lkr.", "Augsburg (Lkr)");
longNameMap.set("Günzburg Lkr.", "Günzburg (Lkr)");
longNameMap.set("Neu-Ulm Lkr.", "Neu-Ulm (Lkr)");
longNameMap.set("Ostallgäu Lkr.", "Ostallgäu (Lkr)");
longNameMap.set("Unterallgäu Lkr.", "Unterallgäu (Lkr)");
longNameMap.set("Donau-Ries Lkr.", "Donau-Ries (Lkr)");
longNameMap.set("Oberallgäu Lkr.", "Oberallgäu (Lkr)");
