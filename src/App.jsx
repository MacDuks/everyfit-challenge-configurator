import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Trophy,
  Target,
  Copy,
  Download,
  Building2,
  Link2,
  Route,
  Users,
  Map,
  Activity,
  Bike,
  Waves,
  Footprints,
} from "lucide-react";

const ACCENT = "#F97316";
const ACCENT_LIGHT = "#FFF3EB";
const ACCENT_BORDER = "#FED7AA";
const STEPS_PER_KM = 1250;
const REQUIRED_FILL = "{НЕОБХОДИМО ЗАПОЛНИТЬ}";

const PEOPLE_PRESETS = [50, 100, 150, 200, 300, 500, 750, 1000];

const challengeTypes = [
  { value: "competitive", label: "Соревновательный" },
  { value: "goal", label: "С общей целью" },
];

const competitiveModes = [
  { value: "team", label: "Командный" },
  { value: "personal", label: "Личный" },
];

const leaderboardModes = [
  { value: "sum", label: "По сумме" },
  { value: "avg", label: "По среднему значению" },
];

const durationModes = [
  { value: "preset", label: "Быстрый выбор" },
  { value: "custom", label: "Свои даты" },
];

const challengeSetupModes = [
  { value: "standard", label: "Стандартные челленджи" },
  { value: "custom", label: "Сконфигурировать самому" },
];

const teamSetupModes = [
  { value: "sheet", label: "Есть готовые команды" },
  { value: "generate", label: "Сформировать команды" },
];

const durationPresets = [
  { value: "week", label: "1 неделя", days: 7 },
  { value: "two_weeks", label: "2 недели", days: 14 },
  { value: "three_weeks", label: "3 недели", days: 21 },
  { value: "month", label: "1 месяц", months: 1 },
];

const activityTypes = [
  { value: "steps", label: "Шаги", icon: Footprints },
  { value: "run", label: "Бег", icon: Activity },
  { value: "bike", label: "Велосипед", icon: Bike },
  { value: "swim", label: "Плавание", icon: Waves },
];

const competitiveActivityTypes = [
  { value: "steps", label: "Шаги", icon: Footprints },
  { value: "run", label: "Бег", icon: Activity },
  { value: "bike", label: "Вело", icon: Bike },
  { value: "swim", label: "Плавание", icon: Waves },
  { value: "moves", label: "Мувы", icon: Route },
  { value: "workouts", label: "Тренировки", icon: Target },
];

const sizeOptions = [
  { value: "small", label: "Маленький" },
  { value: "medium", label: "Средний" },
  { value: "large", label: "Большой" },
  { value: "ultra", label: "Ультра большой" },
];

const teamAdjectives = [
  "Северные",
  "Быстрые",
  "Смелые",
  "Яркие",
  "Сильные",
  "Точные",
  "Легкие",
  "Стремительные",
  "Энергичные",
  "Надежные",
  "Мощные",
  "Высокие",
];

const teamNouns = [
  "Кометы",
  "Волны",
  "Драйверы",
  "Молнии",
  "Орионы",
  "Векторы",
  "Пульсары",
  "Лидеры",
  "Ракеты",
  "Штормы",
  "Пионеры",
  "Темпы",
];

const routeCatalog = [
  {
    id: "lycian",
    metric: "steps",
    size: "small",
    name: "Ликийская тропа",
    goalValue: 650000,
    unit: "шагов",
    suggestedTitle: "Ликийская тропа",
    suggestedDescription:
      "Вместе мы пройдем маршрут вдоль древнего побережья Ликии, где когда-то находились города античного мира, морские гавани и торговые пути. Каждый шаг здесь ощущается как часть большого пути через историю, природу и общее движение команды к одной цели.",
  },
  {
    id: "camino",
    metric: "steps",
    size: "small",
    name: "Камино де Сантьяго",
    goalValue: 975000,
    unit: "шагов",
    suggestedTitle: "Камино де Сантьяго",
    suggestedDescription:
      "Нас ждет путь, который веками проходили паломники со всего мира в поиске смысла, силы и нового этапа. В этом маршруте есть особая глубина: он про ритм, поддержку и ощущение, что большое путешествие складывается из маленьких шагов каждого участника.",
  },
  {
    id: "baikal",
    metric: "steps",
    size: "medium",
    name: "Вокруг Байкала",
    goalValue: 2625000,
    unit: "шагов",
    suggestedTitle: "Вокруг Байкала",
    suggestedDescription:
      "Этот маршрут проходит вокруг одного из самых известных и впечатляющих озер мира, которое давно стало символом силы природы и масштаба России. Здесь особенно чувствуется ценность общего движения: шаг за шагом команда проходит большой путь, наполненный характером, простором и настоящим ощущением дистанции.",
  },
  {
    id: "golden_ring_steps",
    metric: "steps",
    size: "medium",
    name: "По Золотому кольцу",
    goalValue: 1195000,
    unit: "шагов",
    suggestedTitle: "По Золотому кольцу",
    suggestedDescription:
      "Маршрут по городам с богатой историей и сильным культурным образом. Он помогает превратить ежедневную активность команды в красивое путешествие с понятной общей целью и заметным прогрессом.",
  },
  {
    id: "moscow_beijing",
    metric: "steps",
    size: "large",
    name: "Москва - Пекин",
    goalValue: 7250000,
    unit: "шагов",
    suggestedTitle: "Москва - Пекин",
    suggestedDescription:
      "Это маршрут между двумя большими столицами, соединяющий разные культуры, ритмы и целые исторические эпохи. Такое путешествие ощущается как движение через огромный мир, где общий прогресс команды становится заметным, сильным и по-настоящему масштабным.",
  },
  {
    id: "moscow_bali",
    metric: "steps",
    size: "large",
    name: "Москва - Бали",
    goalValue: 12500000,
    unit: "шагов",
    suggestedTitle: "Москва - Бали",
    suggestedDescription:
      "Маршрут ведет от большого города к острову, который ассоциируется с природой, внутренним балансом и обновлением. В нем есть контраст, который делает челлендж особенно живым: путь начинается в привычном ритме и постепенно превращается в большое общее путешествие к яркой и вдохновляющей цели.",
  },
  {
    id: "transsib_steps",
    metric: "steps",
    size: "large",
    name: "По Транссибу",
    goalValue: 11600000,
    unit: "шагов",
    suggestedTitle: "По Транссибу",
    suggestedDescription:
      "Маршрут по мотивам одной из самых известных железных дорог мира задает сильный образ длинного пути через всю страну. Это хороший формат для команды, которой нужен более длительный и масштабный челлендж.",
  },
  {
    id: "earth",
    metric: "steps",
    size: "ultra",
    name: "Вокруг Земли",
    goalValue: 50100000,
    unit: "шагов",
    suggestedTitle: "Вокруг Земли",
    suggestedDescription:
      "Это маршрут с ощущением настоящей экспедиции, где команда словно повторяет путь вокруг планеты, проходя через идею масштаба, открытия и общего усилия. Такой челлендж особенно сильно подчеркивает, как много можно пройти вместе, когда у всех одна цель и один темп движения вперед.",
  },
  {
    id: "moon",
    metric: "steps",
    size: "ultra",
    name: "До Луны",
    goalValue: 480500000,
    unit: "шагов",
    suggestedTitle: "До Луны",
    suggestedDescription:
      "Это маршрут с образом, который сразу отсылает к эпохе больших амбиций, исследований и выхода за пределы привычного. Здесь каждый шаг работает на очень большую цель, а сам челлендж превращается в историю про смелость, командное усилие и путь к тому, что кажется почти невозможным.",
  },
  {
    id: "tokyo_kyoto_run",
    metric: "run",
    size: "small",
    name: "Из Токио в Киото",
    goalValue: 460,
    unit: "км",
    suggestedTitle: "Из Токио в Киото",
    suggestedDescription:
      "Маршрут между двумя важными точками Японии соединяет современный ритм и историческую глубину. Такой челлендж ощущается как красивое путешествие, в котором важен вклад каждого участника.",
  },
  {
    id: "la_sanfran_run",
    metric: "run",
    size: "small",
    name: "Из Лос-Анджелеса в Сан-Франциско",
    goalValue: 620,
    unit: "км",
    suggestedTitle: "Из Лос-Анджелеса в Сан-Франциско",
    suggestedDescription:
      "Маршрут вдоль калифорнийского побережья задает яркий образ и хороший командный темп. Он делает челлендж визуально сильным и помогает легче воспринимать большую цель.",
  },
  {
    id: "berlin_amsterdam_run",
    metric: "run",
    size: "small",
    name: "Из Берлина в Амстердам",
    goalValue: 660,
    unit: "км",
    suggestedTitle: "Из Берлина в Амстердам",
    suggestedDescription:
      "Динамичный маршрут по европейскому направлению, который хорошо подходит для командного ритма и регулярных выходов на пробежку. Он помогает быстро увидеть общий прогресс и держать вовлечение на высоком уровне.",
  },
  {
    id: "paris_barcelona_run",
    metric: "run",
    size: "medium",
    name: "Из Парижа в Барселону",
    goalValue: 1050,
    unit: "км",
    suggestedTitle: "Из Парижа в Барселону",
    suggestedDescription:
      "Маршрут между двумя яркими европейскими городами делает челлендж живым и красивым. Это путь, в котором каждая пробежка добавляет команде движение к большой и понятной цели.",
  },
  {
    id: "moscow_sochi_run",
    metric: "run",
    size: "medium",
    name: "Из Москвы в Сочи",
    goalValue: 1600,
    unit: "км",
    suggestedTitle: "Из Москвы в Сочи",
    suggestedDescription:
      "Это большой маршрут с ощущением длинного пути через города, ритм и смену темпа. Такой челлендж хорошо подходит для команды, которая хочет идти к заметной цели постепенно, но уверенно, превращая каждую пробежку в часть большого общего движения.",
  },
  {
    id: "cape_durban_run",
    metric: "run",
    size: "medium",
    name: "Из Кейптауна в Дурбан",
    goalValue: 1640,
    unit: "км",
    suggestedTitle: "Из Кейптауна в Дурбан",
    suggestedDescription:
      "Большая дистанция вдоль южной части Африки делает челлендж более сильным и амбициозным. Это хороший формат для команды, которая хочет пройти действительно длинный путь вместе.",
  },
  {
    id: "london_rome_run",
    metric: "run",
    size: "large",
    name: "Из Лондона в Рим",
    goalValue: 1910,
    unit: "км",
    suggestedTitle: "Из Лондона в Рим",
    suggestedDescription:
      "Маршрут между двумя великими европейскими столицами делает челлендж более масштабным и атмосферным. Он помогает почувствовать, что каждая тренировка работает на большое путешествие, в котором важен вклад всей команды.",
  },
  {
    id: "newyork_chicago_run",
    metric: "run",
    size: "large",
    name: "Из Нью-Йорка в Чикаго",
    goalValue: 2100,
    unit: "км",
    suggestedTitle: "Из Нью-Йорка в Чикаго",
    suggestedDescription:
      "Длинный городской маршрут с сильным темпом и ощущением настоящей дистанции. Он хорошо подходит для командного бегового челленджа, где цель должна быть достаточно крупной, чтобы сохранять интерес и вовлечение на всем пути.",
  },
  {
    id: "patagonia_run",
    metric: "run",
    size: "large",
    name: "Через Патагонию",
    goalValue: 2800,
    unit: "км",
    suggestedTitle: "Через Патагонию",
    suggestedDescription:
      "Маршрут через один из самых сильных и диких природных регионов мира. Такой челлендж создает ощущение настоящего экспедиционного пути, где важен вклад всей команды на длинной дистанции.",
  },
  {
    id: "lisbon_warsaw_run",
    metric: "run",
    size: "ultra",
    name: "Из Лиссабона в Варшаву",
    goalValue: 3320,
    unit: "км",
    suggestedTitle: "Из Лиссабона в Варшаву",
    suggestedDescription:
      "Большой европейский маршрут, который делает беговой челлендж по-настоящему масштабным. Он подходит для команды, которой нужна длинная цель с ярким ощущением большого общего путешествия.",
  },
  {
    id: "australia_coast_run",
    metric: "run",
    size: "ultra",
    name: "Вдоль побережья Австралии",
    goalValue: 4200,
    unit: "км",
    suggestedTitle: "Вдоль побережья Австралии",
    suggestedDescription:
      "Маршрут с ощущением простора, океана и очень длинной дистанции. Он делает командный беговой челлендж большой историей, к которой хочется возвращаться неделя за неделей.",
  },
  {
    id: "nordkapp_bike",
    metric: "bike",
    size: "small",
    name: "К Северному мысу",
    goalValue: 1700,
    unit: "км",
    suggestedTitle: "К Северному мысу",
    suggestedDescription:
      "Маршрут к одной из самых известных северных точек Европы делает челлендж атмосферным и заметным. Он сочетает красивую идею пути и достаточно большую цель для командного участия.",
  },
  {
    id: "pacific_coast_bike",
    metric: "bike",
    size: "small",
    name: "Тихоокеанское побережье США",
    goalValue: 2900,
    unit: "км",
    suggestedTitle: "Тихоокеанское побережье США",
    suggestedDescription:
      "Маршрут вдоль океана задает яркий образ и делает велочеллендж более живым. Он хорошо подходит для команды, которая хочет идти к красивой и понятной цели.",
  },
  {
    id: "alps_bike",
    metric: "bike",
    size: "small",
    name: "Через Альпы",
    goalValue: 2400,
    unit: "км",
    suggestedTitle: "Через Альпы",
    suggestedDescription:
      "Маршрут с ощущением перевалов, длинных подъемов и красивой европейской дистанции. Он хорошо подходит для тех, кто хочет добавить велочелленджу характер и спортивный образ.",
  },
  {
    id: "australia_cross_bike",
    metric: "bike",
    size: "medium",
    name: "Через Австралию",
    goalValue: 4000,
    unit: "км",
    suggestedTitle: "Через Австралию",
    suggestedDescription:
      "Большой маршрут через континент с ощущением простора, дистанции и настоящего вызова. Такой челлендж хорошо работает как масштабная цель для всей команды.",
  },
  {
    id: "europe_grand_tour_bike",
    metric: "bike",
    size: "medium",
    name: "Гранд-тур по Европе",
    goalValue: 4500,
    unit: "км",
    suggestedTitle: "Гранд-тур по Европе",
    suggestedDescription:
      "Большой маршрут через европейские дороги, перевалы и города, который отлично ощущается как цель для всей команды. Он помогает превратить регулярные велозаезды в одно длинное и красивое путешествие с общим финишем.",
  },
  {
    id: "lisbon_istanbul_bike",
    metric: "bike",
    size: "medium",
    name: "Из Лиссабона в Стамбул",
    goalValue: 4800,
    unit: "км",
    suggestedTitle: "Из Лиссабона в Стамбул",
    suggestedDescription:
      "Маршрут через всю Европу задает большой масштаб и ощущение настоящего велопутешествия. Это сильная цель для команды, которая хочет идти к результату долго и заметно.",
  },
  {
    id: "silk_road_bike",
    metric: "bike",
    size: "large",
    name: "По Великому шелковому пути",
    goalValue: 7000,
    unit: "км",
    suggestedTitle: "По Великому шелковому пути",
    suggestedDescription:
      "Маршрут вдохновлен одним из самых известных торговых путей в истории, который соединял города, культуры и целые миры. Такой челлендж дает ощущение большого путешествия и делает общий прогресс команды особенно значимым.",
  },
  {
    id: "andes_bike",
    metric: "bike",
    size: "large",
    name: "Вдоль Анд",
    goalValue: 6800,
    unit: "км",
    suggestedTitle: "Вдоль Анд",
    suggestedDescription:
      "Маршрут вдоль одной из самых длинных горных систем мира делает велочеллендж более драматичным и сильным. Это большая цель для команды, которая хочет ощутить настоящий масштаб пути.",
  },
  {
    id: "moscow_vladivostok_bike",
    metric: "bike",
    size: "ultra",
    name: "Из Москвы во Владивосток",
    goalValue: 9300,
    unit: "км",
    suggestedTitle: "Из Москвы во Владивосток",
    suggestedDescription:
      "Это маршрут на всю страну - большой, амбициозный и по-настоящему командный. Он делает велочеллендж заметным событием, где общий километраж растет в мощную историю про выносливость, масштаб и движение к одной далекой цели.",
  },
  {
    id: "cairo_capetown_bike",
    metric: "bike",
    size: "ultra",
    name: "Из Каира в Кейптаун",
    goalValue: 10100,
    unit: "км",
    suggestedTitle: "Из Каира в Кейптаун",
    suggestedDescription:
      "Один из самых амбициозных маршрутов для командного велочелленджа. Он превращает каждую поездку в часть огромного пути через континент и делает прогресс особенно впечатляющим.",
  },
  {
    id: "panamericana_bike",
    metric: "bike",
    size: "ultra",
    name: "По Панамериканскому шоссе",
    goalValue: 30000,
    unit: "км",
    suggestedTitle: "По Панамериканскому шоссе",
    suggestedDescription:
      "Флагманский маршрут для по-настоящему большой велоцели. Он задает почти экспедиционный масштаб и делает челлендж центральной историей длинного командного сезона.",
  },
  {
    id: "channel_swim",
    metric: "swim",
    size: "small",
    name: "Через Ла-Манш",
    goalValue: 34,
    unit: "км",
    suggestedTitle: "Через Ла-Манш",
    suggestedDescription:
      "Маршрут вдохновлен одной из самых известных плавательных дистанций в мире. Он хорошо подходит для быстрого командного старта и помогает сделать цель понятной уже с первых тренировок.",
  },
  {
    id: "bosphorus_swim",
    metric: "swim",
    size: "small",
    name: "Через Босфор",
    goalValue: 6.5,
    unit: "км",
    suggestedTitle: "Через Босфор",
    suggestedDescription:
      "Маршрут с сильным образом перехода между двумя берегами и двумя мирами. Он делает плавательный челлендж ярким и легко считываемым для участников.",
  },
  {
    id: "baltic_swim",
    metric: "swim",
    size: "small",
    name: "Через Балтийское море",
    goalValue: 1500,
    unit: "км",
    suggestedTitle: "Через Балтийское море",
    suggestedDescription:
      "Сдержанный, но сильный маршрут с европейским характером и хорошим масштабом для командного челленджа. Он помогает сделать прогресс понятным и ощутимым на всей дистанции.",
  },
  {
    id: "caribbean_swim",
    metric: "swim",
    size: "medium",
    name: "По Карибской дуге",
    goalValue: 2800,
    unit: "км",
    suggestedTitle: "По Карибской дуге",
    suggestedDescription:
      "Яркий маршрут с атмосферой открытой воды и длинного плавательного пути. Он хорошо подходит для команды, которая хочет пройти заметную дистанцию в легком, но амбициозном формате.",
  },
  {
    id: "nordic_swim",
    metric: "swim",
    size: "medium",
    name: "По северным морям",
    goalValue: 3200,
    unit: "км",
    suggestedTitle: "По северным морям",
    suggestedDescription:
      "Маршрут с ощущением холодной воды, длинной дистанции и настоящего характера. Такой челлендж подходит для команды, которая хочет более сильную и выразительную плавательную цель.",
  },
  {
    id: "mediterranean_swim",
    metric: "swim",
    size: "medium",
    name: "Через Средиземное море",
    goalValue: 4000,
    unit: "км",
    suggestedTitle: "Через Средиземное море",
    suggestedDescription:
      "Маршрут с богатой историей, древними берегами и образом большого морского пути. Он помогает превратить регулярные тренировки в красивое движение к сильной общей цели.",
  },
  {
    id: "japan_swim",
    metric: "swim",
    size: "large",
    name: "Вдоль Японского архипелага",
    goalValue: 3000,
    unit: "км",
    suggestedTitle: "Вдоль Японского архипелага",
    suggestedDescription:
      "Маршрут вдоль островов Японии делает челлендж более атмосферным и масштабным. Он хорошо работает как длинная плавательная цель, к которой команда идет постепенно и вместе.",
  },
  {
    id: "atlantic_crossing_swim",
    metric: "swim",
    size: "large",
    name: "Через Атлантику",
    goalValue: 5600,
    unit: "км",
    suggestedTitle: "Через Атлантику",
    suggestedDescription:
      "Маршрут с ощущением большой воды, длинной дистанции и настоящей командной амбиции. Он превращает каждую тренировку в часть мощного общего заплыва, где прогресс постепенно складывается в большое достижение.",
  },
  {
    id: "africa_antarctica_swim",
    metric: "swim",
    size: "ultra",
    name: "От Африки до Антарктиды",
    goalValue: 7350,
    unit: "км",
    suggestedTitle: "От Африки до Антарктиды",
    suggestedDescription:
      "Это маршрут с по-настоящему большим размахом - от теплых вод к ледяному югу, где каждый километр складывается в сильную общую цель. Такой челлендж отлично подходит для команды, которая хочет не просто плавать, а идти к чему-то действительно масштабному.",
  },
  {
    id: "pacific_swim",
    metric: "swim",
    size: "ultra",
    name: "Через Тихий океан",
    goalValue: 8000,
    unit: "км",
    suggestedTitle: "Через Тихий океан",
    suggestedDescription:
      "Один из самых больших и амбициозных маршрутов в подборке. Он создает ощущение настоящей экспедиции и делает плавательный челлендж сильной общей историей для всей команды.",
  },
  {
    id: "arctic_swim",
    metric: "swim",
    size: "ultra",
    name: "Через Арктику",
    goalValue: 9000,
    unit: "км",
    suggestedTitle: "Через Арктику",
    suggestedDescription:
      "Флагманский плавательный маршрут с очень сильным образом и ощущением экстремально большой цели. Он подходит для команды, которой нужен действительно амбициозный и редкий по масштабу челлендж.",
  },
];

function formatNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: Number.isInteger(number) ? 0 : 1,
  }).format(number);
}

function stepsFromKm(km) {
  return Math.round((km * STEPS_PER_KM) / 5000) * 5000;
}

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getEndDateFromPreset(startDate, presetValue) {
  const preset = durationPresets.find((item) => item.value === presetValue);
  if (!startDate || !preset) {
    return startDate;
  }

  const nextDate = new Date(`${startDate}T00:00:00`);

  if (Number.isNaN(nextDate.getTime())) {
    return startDate;
  }

  if (preset.months) {
    nextDate.setMonth(nextDate.getMonth() + preset.months);
  } else if (preset.days) {
    nextDate.setDate(nextDate.getDate() + preset.days);
  }

  return formatDateInput(nextDate);
}

function generateTeamNames(count) {
  const safeCount = Math.max(0, Number(count) || 0);
  const maxCombinations = teamAdjectives.length * teamNouns.length;
  const targetCount = Math.min(safeCount, maxCombinations);
  const usedNames = new Set();
  const generatedNames = [];

  while (generatedNames.length < targetCount) {
    const adjective = teamAdjectives[Math.floor(Math.random() * teamAdjectives.length)];
    const noun = teamNouns[Math.floor(Math.random() * teamNouns.length)];
    const teamName = `${adjective} ${noun}`;

    if (usedNames.has(teamName)) {
      continue;
    }

    usedNames.add(teamName);
    generatedNames.push(teamName);
  }

  return generatedNames;
}

function getMetricConfig(metric) {
  switch (metric) {
    case "run":
      return { label: "Бег", unit: "км", inputLabel: "Километры" };
    case "bike":
      return { label: "Велосипед", unit: "км", inputLabel: "Километры" };
    case "swim":
      return { label: "Плавание", unit: "км", inputLabel: "Километры" };
    default:
      return { label: "Шаги", unit: "шагов", inputLabel: "Шаги" };
  }
}

function getCompetitiveMetricConfig(metric) {
  switch (metric) {
    case "run":
      return { label: "Бег", unit: "км" };
    case "bike":
      return { label: "Вело", unit: "км" };
    case "swim":
      return { label: "Плавание", unit: "км" };
    case "moves":
      return { label: "Мувы", unit: "мувов" };
    case "workouts":
      return { label: "Тренировки", unit: "количество" };
    default:
      return { label: "Шаги", unit: "шагов" };
  }
}

function getActivityTypeValue(metric) {
  switch (metric) {
    case "run":
      return "running";
    case "bike":
      return "cycling";
    case "swim":
      return "swimming";
    case "moves":
      return "moves";
    case "workouts":
      return "workouts";
    default:
      return "walking";
  }
}

function formatDateToUtcStart(dateString) {
  return dateString ? `${dateString}T00:00:00Z` : REQUIRED_FILL;
}

function getCustomChallengePreset(metric) {
  const metricConfig = getMetricConfig(metric);
  return {
    title: "Свой маршрут",
    description:
      "Соберите маршрут под темп, формат и цель вашей команды. Здесь можно задать собственную дистанцию и создать челлендж, который лучше всего подходит именно под ваш запуск.",
    unit: metricConfig.unit,
  };
}

function getSizeLabel(size) {
  return sizeOptions.find((item) => item.value === size)?.label || "-";
}

function ChoiceChips({ value, onChange, options, columns = 2 }) {
  const columnClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : columns === 2
          ? "grid-cols-1 sm:grid-cols-2"
          : "grid-cols-2 xl:grid-cols-4";

  return (
    <div className={`grid ${columnClass} gap-1.5 md:gap-2`}>
      {options.map((option) => {
        const active = option.value === value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`min-h-[48px] rounded-2xl border px-2.5 py-2.5 text-left text-[12px] font-medium leading-snug transition-all md:min-h-[52px] md:px-3 md:py-3 md:text-[13px] ${
              active
                ? "border-[#F97316] bg-[#FFF3EB] text-[#C2410C] shadow-[0_8px_24px_rgba(249,115,22,0.12)]"
                : "border-[#E5E7EB] bg-white text-slate-700 hover:border-[#FDBA74] hover:text-[#C2410C]"
            }`}
          >
            <span className="flex items-center gap-1.5 md:gap-2">
              {Icon ? <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" /> : null}
              <span className="break-words">{option.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FieldCard({ icon: Icon, title, subtitle, children, index }) {
  return (
    <Card className="rounded-[28px] border border-[#ECECEC] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <CardHeader className="px-5 pb-4 pt-5 md:px-6 md:pt-6">
        <CardTitle className="flex items-center gap-3 text-[15px] font-semibold text-slate-900 md:text-base">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold"
            style={{ backgroundColor: ACCENT_LIGHT, color: ACCENT }}
          >
            {index || <Icon className="h-5 w-5" />}
          </span>
          <span>
            <span className="block">{title}</span>
            {subtitle ? <span className="mt-1 block text-[13px] font-normal leading-snug text-slate-500 md:text-sm">{subtitle}</span> : null}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-5 pb-5 md:px-6 md:pb-6">{children}</CardContent>
    </Card>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[24px] border border-[#ECECEC] bg-[#FAFAFA] p-4">
      <div className="mb-2 flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-[0.02em] md:text-sm md:normal-case md:tracking-normal">{label}</span>
      </div>
      <div className="break-words text-[14px] font-semibold leading-snug text-slate-900 md:text-sm">{value}</div>
    </div>
  );
}

function PeoplePresetSelector({ presetValue, customValue, onPresetSelect, onCustomChange }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
        {PEOPLE_PRESETS.map((preset) => {
          const active = presetValue === String(preset);
          return (
            <button
              key={preset}
              type="button"
              onClick={() => onPresetSelect(String(preset))}
              className={`h-11 rounded-2xl border text-[13px] font-medium transition-all md:text-sm ${
                active
                  ? "border-[#F97316] bg-[#FFF3EB] text-[#C2410C]"
                  : "border-[#E5E7EB] bg-white text-slate-700 hover:border-[#FDBA74]"
              }`}
            >
              {preset}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onPresetSelect("custom")}
          className={`h-11 rounded-2xl border px-4 text-[13px] font-medium transition-all md:text-sm ${
            presetValue === "custom"
              ? "border-[#F97316] bg-[#FFF3EB] text-[#C2410C]"
              : "border-[#E5E7EB] bg-white text-slate-700 hover:border-[#FDBA74]"
          }`}
        >
          Другое
        </button>
      </div>

      {presetValue === "custom" ? (
        <Input
          type="number"
          min="1"
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          className="h-12 rounded-2xl border-[#E5E7EB] bg-white focus-visible:ring-[#F97316]"
          placeholder="Введите свое значение"
        />
      ) : null}
    </div>
  );
}

function RouteCard({ route, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(route.id)}
      className={`w-full rounded-[24px] border p-4 text-left transition-all ${
        isSelected
          ? "border-[#F97316] bg-[#FFF3EB] text-[#C2410C] shadow-[0_10px_24px_rgba(249,115,22,0.12)]"
          : "border-[#ECECEC] bg-white text-slate-900 hover:border-[#FDBA74]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold leading-snug md:text-base">{route.name}</div>
          <div className={`mt-1 text-[13px] md:text-sm ${isSelected ? "text-[#C2410C]" : "text-slate-500"}`}>
            {formatNumber(route.goalValue)} {route.unit}
          </div>
        </div>
        <Badge
          className="shrink-0 rounded-full border-0 px-2.5 py-1 text-[10px] font-medium md:px-3 md:text-[11px]"
          style={{
            backgroundColor: isSelected ? "#FFE7D4" : "#F5F5F5",
            color: isSelected ? "#C2410C" : "#475569",
          }}
        >
          {getSizeLabel(route.size)}
        </Badge>
      </div>
    </button>
  );
}

export default function EveryFitChallengeConfigurator() {
  const [form, setForm] = useState({
    companyName: "Компания demo",
    companyLink: "https://company.demo",
    peoplePreset: "100",
    peopleCustom: "",
    challengeType: "goal",
    competitiveMode: "team",
    leaderboardMode: "sum",
    competitiveMetric: "steps",
    goalMetric: "steps",
    title: "Камино де Сантьяго",
    description:
      "Нас ждет путь, который веками проходили паломники со всего мира в поиске смысла, силы и нового этапа. В этом маршруте есть особая глубина: он про ритм, поддержку и ощущение, что большое путешествие складывается из маленьких шагов каждого участника.",
    routeId: "camino",
    goalValue: "1000000",
    customRouteName: "",
    challengeSetupMode: "standard",
    teamSetupMode: "sheet",
    teamSheetLink: "",
    teamCount: "4",
    generatedTeamNames: generateTeamNames(4),
    durationMode: "preset",
    durationPreset: "month",
    startDate: "2026-04-27",
    endDate: "2026-05-27",
  });

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleDurationModeChange = (mode) => {
    setForm((prev) => ({
      ...prev,
      durationMode: mode,
      endDate: mode === "preset" ? getEndDateFromPreset(prev.startDate, prev.durationPreset) : prev.endDate,
    }));
  };

  const handleDurationPresetChange = (presetValue) => {
    setForm((prev) => ({
      ...prev,
      durationPreset: presetValue,
      durationMode: "preset",
      endDate: getEndDateFromPreset(prev.startDate, presetValue),
    }));
  };

  const handleStartDateChange = (startDate) => {
    setForm((prev) => ({
      ...prev,
      startDate,
      endDate: prev.durationMode === "preset" ? getEndDateFromPreset(startDate, prev.durationPreset) : prev.endDate,
    }));
  };

  const handleChallengeSetupModeChange = (mode) => {
    setForm((prev) => {
      if (mode === "custom") {
        const customPreset = getCustomChallengePreset(prev.goalMetric);
        return {
          ...prev,
          challengeSetupMode: "custom",
          routeId: "custom",
          title: prev.routeId === "custom" ? prev.title : customPreset.title,
          description: prev.routeId === "custom" ? prev.description : customPreset.description,
        };
      }

      const firstRoute = routeCatalog.find((route) => route.metric === prev.goalMetric);
      if (!firstRoute) {
        return { ...prev, challengeSetupMode: "standard" };
      }

      return {
        ...prev,
        challengeSetupMode: "standard",
        routeId: firstRoute.id,
        title: firstRoute.suggestedTitle,
        description: firstRoute.suggestedDescription,
        goalValue: String(firstRoute.goalValue),
      };
    });
  };

  const handleTeamSetupModeChange = (mode) => {
    setForm((prev) => ({
      ...prev,
      teamSetupMode: mode,
      generatedTeamNames:
        mode === "generate" && prev.generatedTeamNames.length === 0
          ? generateTeamNames(prev.teamCount)
          : prev.generatedTeamNames,
    }));
  };

  const handleTeamCountChange = (teamCount) => {
    setForm((prev) => ({
      ...prev,
      teamCount,
      teamSetupMode: "generate",
      generatedTeamNames: generateTeamNames(teamCount),
    }));
  };

  const regenerateTeamNames = () => {
    setForm((prev) => ({
      ...prev,
      generatedTeamNames: generateTeamNames(prev.teamCount),
    }));
  };

  const peopleCount = useMemo(() => {
    return form.peoplePreset === "custom" ? Number(form.peopleCustom) || 0 : Number(form.peoplePreset) || 0;
  }, [form.peoplePreset, form.peopleCustom]);

  const filteredRoutes = useMemo(() => {
    return routeCatalog.filter((route) => route.metric === form.goalMetric);
  }, [form.goalMetric]);

  const groupedRoutes = useMemo(() => {
    return sizeOptions
      .map((sizeOption) => ({
        ...sizeOption,
        routes: filteredRoutes.filter((route) => route.size === sizeOption.value),
      }))
      .filter((group) => group.routes.length > 0);
  }, [filteredRoutes]);

  const metricConfig = useMemo(() => getMetricConfig(form.goalMetric), [form.goalMetric]);

  const selectedRoute = useMemo(() => {
    if (form.routeId === "custom") {
      return {
        id: "custom",
        name: form.customRouteName || "Свой челлендж",
        goalValue: Number(form.goalValue) || 0,
        unit: metricConfig.unit,
        size: null,
      };
    }

    return filteredRoutes.find((route) => route.id === form.routeId) || filteredRoutes[0] || null;
  }, [form.routeId, form.customRouteName, form.goalValue, filteredRoutes, metricConfig.unit]);

  const applyRoutePreset = (routeId) => {
    if (routeId === "custom") {
      const customPreset = getCustomChallengePreset(form.goalMetric);
      setForm((prev) => ({
        ...prev,
        challengeSetupMode: "custom",
        routeId: "custom",
        title: customPreset.title,
        description: customPreset.description,
      }));
      return;
    }

    const route = routeCatalog.find((item) => item.id === routeId);
    if (!route) return;

    setForm((prev) => ({
      ...prev,
      challengeSetupMode: "standard",
      routeId,
      title: route.suggestedTitle,
      description: route.suggestedDescription,
      goalValue: String(route.goalValue),
    }));
  };

  const handleGoalMetricChange = (metric) => {
    const firstRoute = routeCatalog.find((route) => route.metric === metric);
    if (!firstRoute) return;

    setForm((prev) => ({
      ...prev,
      goalMetric: metric,
      routeId: prev.challengeSetupMode === "custom" ? "custom" : firstRoute.id,
      title:
        prev.challengeSetupMode === "custom" ? getCustomChallengePreset(metric).title : firstRoute.suggestedTitle,
      description:
        prev.challengeSetupMode === "custom"
          ? getCustomChallengePreset(metric).description
          : firstRoute.suggestedDescription,
      goalValue: prev.challengeSetupMode === "custom" ? prev.goalValue : String(firstRoute.goalValue),
      customRouteName: "",
    }));
  };

  const preview = useMemo(() => {
    const challengeTypeLabel = challengeTypes.find((item) => item.value === form.challengeType)?.label;
    const competitiveModeLabel = competitiveModes.find((item) => item.value === form.competitiveMode)?.label;
    const leaderboardLabel = leaderboardModes.find((item) => item.value === form.leaderboardMode)?.label;
    const competitiveMetricConfig = getCompetitiveMetricConfig(form.competitiveMetric);

    return {
      name: form.title,
      description: form.description,
      company_name: form.companyName,
      company_link: form.companyLink,
      people_count: peopleCount,
      challenge_type: challengeTypeLabel,
      competitive_mode: form.challengeType === "competitive" ? competitiveModeLabel : null,
      leaderboard_mode:
        form.challengeType === "competitive" && form.competitiveMode === "team" ? leaderboardLabel : null,
      team_setup:
        form.challengeType === "competitive" && form.competitiveMode === "team"
          ? {
              source: form.teamSetupMode === "sheet" ? "excel_sheet" : "generated",
              sheet_link: form.teamSetupMode === "sheet" ? form.teamSheetLink || null : null,
              team_count: form.teamSetupMode === "generate" ? Number(form.teamCount) || 0 : null,
              team_names: form.teamSetupMode === "generate" ? form.generatedTeamNames : null,
            }
          : null,
      metric: form.challengeType === "goal" ? metricConfig.label : competitiveMetricConfig.label,
      metric_unit: form.challengeType === "goal" ? metricConfig.unit : competitiveMetricConfig.unit,
      start_date: form.startDate,
      end_date: form.endDate,
      goal_route:
        form.challengeType === "goal"
          ? {
              name: selectedRoute?.name || "-",
              value: Number(form.goalValue) || 0,
              unit: metricConfig.unit,
              size_label: selectedRoute?.size ? getSizeLabel(selectedRoute.size) : null,
              is_custom: form.routeId === "custom",
            }
          : null,
    };
  }, [form, peopleCount, metricConfig, selectedRoute]);

  const previewJson = useMemo(() => {
    const selectedMetric = form.challengeType === "goal" ? form.goalMetric : form.competitiveMetric;
    const teams =
      form.challengeType === "competitive" && form.competitiveMode === "team" && form.teamSetupMode === "generate"
        ? form.generatedTeamNames.map((name) => ({
            name: name || REQUIRED_FILL,
          }))
        : REQUIRED_FILL;

    const json = {
      title: form.title?.trim() || REQUIRED_FILL,
      description: form.description?.trim() || REQUIRED_FILL,
      start_date: formatDateToUtcStart(form.startDate),
      end_date: formatDateToUtcStart(form.endDate),
      challenge_type: form.challengeType === "goal" ? "goal_based" : "competitive",
      level:
        form.challengeType === "competitive"
          ? form.competitiveMode === "team"
            ? "overall"
            : "personal"
          : "overall",
      scoring_method:
        form.challengeType === "competitive" && form.competitiveMode === "team" ? form.leaderboardMode : "sum",
      activity_type: getActivityTypeValue(selectedMetric),
      metric: selectedMetric || REQUIRED_FILL,
      teams,
    };

    if (form.challengeType === "goal") {
      json.target_value = Number(form.goalValue) || REQUIRED_FILL;
    }

    return json;
  }, [form]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(previewJson, null, 2));
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportPdf = async () => {
    const chipStyle = {
      margin: [0, 0, 8, 8],
      fillColor: "#FFEDD5",
      color: "#C2410C",
      bold: true,
      fontSize: 11,
    };

    const infoCard = (label, value) => ({
      stack: [
        { text: label, color: "#64748B", fontSize: 11, margin: [0, 0, 0, 6] },
        { text: value || "-", color: "#0F172A", bold: true, fontSize: 13, lineHeight: 1.3 },
      ],
      fillColor: "#FFFFFF",
      margin: [0, 0, 0, 0],
    });

    const parameterChips = [
      `Вид: ${preview.challenge_type || "-"}`,
      preview.competitive_mode ? `Формат: ${preview.competitive_mode}` : null,
      preview.metric ? `Активность: ${preview.metric}${preview.metric_unit ? ` (${preview.metric_unit})` : ""}` : null,
      preview.leaderboard_mode ? `Лидерборд: ${preview.leaderboard_mode}` : null,
    ].filter(Boolean);

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [28, 28, 28, 28],
      content: [
        {
          stack: [
            {
              columns: [
                {
                  width: "*",
                  stack: [
                    {
                      columns: [
                        { text: preview.challenge_type || "-", style: "heroChip" },
                        { text: `${preview.metric || "-"}${preview.metric_unit ? ` • ${preview.metric_unit}` : ""}`, style: "heroChip" },
                        ...(preview.competitive_mode ? [{ text: preview.competitive_mode, style: "heroChip" }] : []),
                        ...(preview.goal_route?.size_label ? [{ text: preview.goal_route.size_label, style: "heroChip" }] : []),
                      ],
                      columnGap: 0,
                      margin: [0, 0, 0, 12],
                    },
                    { text: preview.name || "-", style: "heroTitle" },
                    { text: preview.description || "-", style: "heroDescription" },
                  ],
                },
              ],
            },
          ],
          fillColor: "#FFF7ED",
          margin: [0, 0, 0, 16],
          border: [true, true, true, true],
        },
        {
          table: {
            widths: ["*", "*"],
            body: [
              [infoCard("Компания", preview.company_name || "-"), infoCard("Количество человек", formatNumber(preview.people_count))],
              [infoCard("Старт", preview.start_date || "-"), infoCard("Окончание", preview.end_date || "-")],
            ],
          },
          layout: "cardGrid",
          margin: [0, 0, 0, 16],
        },
        {
          stack: [
            { text: "Параметры челленджа", style: "sectionTitle" },
            {
              columns: parameterChips.map((text) => ({ text, style: "plainChip" })),
              columnGap: 0,
            },
          ],
          style: "sectionCard",
        },
        ...(preview.team_setup
          ? [
              {
                stack: [
                  { text: "Команды", style: "sectionTitle" },
                  ...(preview.team_setup.sheet_link
                    ? [
                        {
                          table: {
                            widths: ["*"],
                            body: [[infoCard("Excel-таблица", preview.team_setup.sheet_link)]],
                          },
                          layout: "cardGrid",
                        },
                      ]
                    : [
                        {
                          table: {
                            widths: ["*"],
                            body: [[infoCard("Количество команд", formatNumber(preview.team_setup.team_count))]],
                          },
                          layout: "cardGrid",
                          margin: [0, 0, 0, 12],
                        },
                        {
                          columns: (preview.team_setup.team_names || []).map((teamName) => ({
                            text: teamName,
                            style: "plainChip",
                          })),
                          columnGap: 0,
                        },
                      ]),
                ],
                style: "sectionCard",
              },
            ]
          : []),
        ...(preview.goal_route
          ? [
              {
                stack: [
                  { text: "Цель", style: "sectionTitle" },
                  {
                    table: {
                      widths: ["*", "*"],
                      body: [
                        [
                          infoCard("Маршрут", preview.goal_route.name),
                          infoCard(preview.metric, `${formatNumber(preview.goal_route.value)} ${preview.goal_route.unit}`),
                        ],
                      ],
                    },
                    layout: "cardGrid",
                  },
                ],
                style: "sectionCard",
              },
            ]
          : []),
        {
          stack: [
            { text: "Ссылка на компанию", style: "sectionTitle" },
            { text: preview.company_link || "-", style: "linkValue" },
          ],
          style: "sectionCard",
        },
        {
          stack: [
            { text: "JSON-конфиг", style: "sectionTitle" },
            { text: JSON.stringify(previewJson, null, 2), style: "jsonBlock" },
          ],
          style: "sectionCard",
        },
      ],
      styles: {
        heroChip: chipStyle,
        plainChip: {
          ...chipStyle,
          fillColor: "#F1F5F9",
          color: "#334155",
        },
        heroTitle: {
          fontSize: 22,
          bold: true,
          color: "#0F172A",
          margin: [0, 0, 0, 10],
        },
        heroDescription: {
          fontSize: 12,
          color: "#475569",
          lineHeight: 1.5,
        },
        sectionCard: {
          margin: [0, 0, 0, 16],
          fillColor: "#FFFFFF",
        },
        sectionTitle: {
          fontSize: 15,
          bold: true,
          color: "#0F172A",
          margin: [0, 0, 0, 12],
        },
        linkValue: {
          fontSize: 12,
          color: "#C2410C",
        },
        jsonBlock: {
          fontSize: 9,
          color: "#475569",
          lineHeight: 1.4,
        },
      },
      defaultStyle: {
        font: "Roboto",
      },
    };

    docDefinition.content[0].margin = [0, 0, 0, 16];
    docDefinition.content[0].table = {
      widths: ["*"],
      body: [[docDefinition.content[0]]],
    };

    docDefinition.content[0].layout = {
      hLineWidth: () => 1,
      vLineWidth: () => 1,
      hLineColor: () => "#FED7AA",
      vLineColor: () => "#FED7AA",
      paddingLeft: () => 20,
      paddingRight: () => 20,
      paddingTop: () => 18,
      paddingBottom: () => 18,
    };

    docDefinition.content[0] = {
      table: {
        widths: ["*"],
        body: [[docDefinition.content[0].table.body[0][0]]],
      },
      layout: docDefinition.content[0].layout,
      margin: [0, 0, 0, 16],
    };

    docDefinition.layouts = {
      cardGrid: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => "#E5E7EB",
        vLineColor: () => "#E5E7EB",
        paddingLeft: () => 14,
        paddingRight: () => 14,
        paddingTop: () => 14,
        paddingBottom: () => 14,
      },
    };

    const [{ default: pdfMake }, { default: pdfFonts }] = await Promise.all([
      import("pdfmake/build/pdfmake"),
      import("pdfmake/build/vfs_fonts"),
    ]);

    pdfMake.addVirtualFileSystem(pdfFonts);
    pdfMake.createPdf(docDefinition).download("everyfit-challenge-config.pdf");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 overflow-hidden rounded-[32px] border border-[#ECECEC] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.04)]"
        >
          <div className="px-6 py-5 md:px-8">
            <h1 className="text-[28px] font-semibold tracking-tight md:text-3xl">Настройка корпоративного челленджа</h1>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <FieldCard icon={Building2} index="1" title="Основа" subtitle="Компания, формат и даты">
              <div className="space-y-2">
                <Label className="text-slate-700">Название компании</Label>
                <Input
                  value={form.companyName}
                  onChange={(e) => setField("companyName", e.target.value)}
                  className="h-12 rounded-2xl border-[#E5E7EB] bg-white focus-visible:ring-[#F97316]"
                  placeholder="Например, EveryFit"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Тип челленджа</Label>
                <ChoiceChips
                  value={form.challengeType}
                  onChange={(v) => setField("challengeType", v)}
                  options={challengeTypes}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Длительность</Label>
                <ChoiceChips value={form.durationMode} onChange={handleDurationModeChange} options={durationModes} />
              </div>

              {form.durationMode === "preset" ? (
                <div className="space-y-2">
                  <Label className="text-slate-700">Быстрый выбор периода</Label>
                  <ChoiceChips
                    value={form.durationPreset}
                    onChange={handleDurationPresetChange}
                    options={durationPresets}
                    columns={4}
                  />
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-slate-700">Дата старта</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="h-12 rounded-2xl border-[#E5E7EB] bg-white focus-visible:ring-[#F97316]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Дата окончания</Label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => {
                      handleDurationModeChange("custom");
                      setField("endDate", e.target.value);
                    }}
                    className="h-12 rounded-2xl border-[#E5E7EB] bg-white focus-visible:ring-[#F97316]"
                    disabled={form.durationMode === "preset"}
                  />
                </div>
              </div>

              <div className="text-[13px] leading-snug text-slate-500 md:text-sm">
                В быстром режиме дата окончания считается автоматически от даты старта. Если нужен произвольный диапазон,
                переключитесь на режим "Свои даты".
              </div>

              <details className="group rounded-[24px] border border-[#ECECEC] bg-[#FAFAFA] p-4 md:p-5">
                <summary className="cursor-pointer list-none text-[14px] font-semibold text-slate-900 md:text-[15px]">
                  Дополнительная информация
                </summary>

                <div className="mt-4 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-slate-700">Ссылка на компанию</Label>
                    <Input
                      value={form.companyLink}
                      onChange={(e) => setField("companyLink", e.target.value)}
                      className="h-12 rounded-2xl border-[#E5E7EB] bg-white focus-visible:ring-[#F97316]"
                      placeholder="https://company.ru"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700">Количество человек</Label>
                    <PeoplePresetSelector
                      presetValue={form.peoplePreset}
                      customValue={form.peopleCustom}
                      onPresetSelect={(value) => setField("peoplePreset", value)}
                      onCustomChange={(value) => setField("peopleCustom", value)}
                    />
                  </div>
                </div>
              </details>
            </FieldCard>

            <FieldCard icon={Target} index="2" title="Механика" subtitle="Как устроен челлендж">
              {form.challengeType === "goal" ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-slate-700">Тип активности</Label>
                    <div className="rounded-[26px] bg-[#F8FAFC] p-1">
                      <ChoiceChips
                        value={form.goalMetric}
                        onChange={handleGoalMetricChange}
                        options={activityTypes}
                        columns={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700">Вариант настройки</Label>
                    <ChoiceChips
                      value={form.challengeSetupMode}
                      onChange={handleChallengeSetupModeChange}
                      options={challengeSetupModes}
                    />
                  </div>

                  {form.challengeSetupMode === "standard" ? (
                    <div className="space-y-3 rounded-[28px] border border-[#F1F5F9] bg-white p-4 md:p-5">
                      <div className="space-y-1">
                        <div className="text-[15px] font-semibold text-slate-900 md:text-base">Стандартные маршруты</div>
                        <div className="text-[13px] leading-snug text-slate-500 md:text-sm">
                          Готовые варианты сгруппированы по масштабу. Для шагов используется пересчет:
                          {` ${formatNumber(STEPS_PER_KM)} шагов = 1 км.`}
                        </div>
                      </div>

                      {groupedRoutes.map((group, index) => (
                        <div
                          key={group.value}
                          className={`space-y-3 rounded-[28px] ${index > 0 ? "border-t border-[#F1F5F9] pt-5" : ""}`}
                        >
                          <div className="grid gap-3 md:grid-cols-2">
                            {group.routes.map((route) => (
                              <RouteCard
                                key={route.id}
                                route={route}
                                isSelected={route.id === form.routeId}
                                onSelect={applyRoutePreset}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 rounded-[28px] border border-[#F1F5F9] bg-[#FCFCFD] p-4 md:p-5">
                      <div className="space-y-1">
                        <div className="text-[15px] font-semibold text-slate-900 md:text-base">Свой маршрут</div>
                        <div className="text-[13px] leading-snug text-slate-500 md:text-sm">
                          Укажите маршрут и цель вручную, если готовые варианты не подходят.
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700">Название маршрута</Label>
                        <Input
                          value={form.customRouteName}
                          onChange={(e) => setField("customRouteName", e.target.value)}
                          className="h-12 rounded-2xl border-[#E5E7EB] bg-white focus-visible:ring-[#F97316]"
                          placeholder="Например, До Казани"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-slate-700">Цель челленджа</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min="0"
                        value={form.goalValue}
                        onChange={(e) => setField("goalValue", e.target.value)}
                        className="h-12 rounded-2xl border-[#E5E7EB] bg-white pr-20 focus-visible:ring-[#F97316]"
                        placeholder={metricConfig.inputLabel}
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                        {metricConfig.unit}
                      </span>
                    </div>
                    <div className="text-[13px] leading-snug text-slate-500 md:text-sm">
                      Можно использовать значение из маршрута или задать свое вручную.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="text-slate-700">Формат соревнования</Label>
                    <ChoiceChips
                      value={form.competitiveMode}
                      onChange={(v) => setField("competitiveMode", v)}
                      options={competitiveModes}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700">Тип активности</Label>
                    <div className="rounded-[26px] bg-[#F8FAFC] p-1">
                      <ChoiceChips
                        value={form.competitiveMetric}
                        onChange={(v) => setField("competitiveMetric", v)}
                        options={competitiveActivityTypes}
                        columns={3}
                      />
                    </div>
                  </div>

                  {form.competitiveMode === "team" ? (
                    <>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Подсчет лидерборда</Label>
                        <ChoiceChips
                          value={form.leaderboardMode}
                          onChange={(v) => setField("leaderboardMode", v)}
                          options={leaderboardModes}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700">Команды</Label>
                        <ChoiceChips
                          value={form.teamSetupMode}
                          onChange={handleTeamSetupModeChange}
                          options={teamSetupModes}
                        />
                      </div>

                      {form.teamSetupMode === "sheet" ? (
                        <div className="space-y-2 rounded-[24px] border border-[#F1F5F9] bg-[#FCFCFD] p-4">
                          <Label className="text-slate-700">Ссылка на онлайн Excel-таблицу</Label>
                          <Input
                            value={form.teamSheetLink}
                            onChange={(e) => setField("teamSheetLink", e.target.value)}
                            className="h-12 rounded-2xl border-[#E5E7EB] bg-white focus-visible:ring-[#F97316]"
                            placeholder="https://..."
                          />
                          <div className="text-[13px] leading-snug text-slate-500 md:text-sm">
                            Подойдет публичная или рабочая ссылка на таблицу с командами.
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 rounded-[24px] border border-[#F1F5F9] bg-[#FCFCFD] p-4">
                          <div className="space-y-2">
                            <Label className="text-slate-700">Количество команд</Label>
                            <div className="flex flex-col gap-3 md:flex-row">
                              <Input
                                type="number"
                                min="2"
                                value={form.teamCount}
                                onChange={(e) => handleTeamCountChange(e.target.value)}
                                className="h-12 rounded-2xl border-[#E5E7EB] bg-white focus-visible:ring-[#F97316] md:max-w-[180px]"
                              />
                              <Button
                                type="button"
                                className="rounded-2xl border border-[#E5E7EB] bg-white text-slate-700 hover:border-[#FDBA74] md:shrink-0"
                                onClick={regenerateTeamNames}
                              >
                                Придумать заново
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-700">Сгенерированные названия</Label>
                            <div className="flex flex-wrap gap-2">
                              {form.generatedTeamNames.map((teamName) => (
                                <Badge
                                  key={teamName}
                                  className="rounded-full border-0 bg-[#F5F5F5] px-3 py-1 text-slate-700"
                                >
                                  {teamName}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : null}
                </>
              )}
            </FieldCard>

            <FieldCard icon={Route} index="3" title="Контент" subtitle="Название и описание для участников">
              <div className="space-y-2">
                <Label className="text-slate-700">Название челленджа</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  className="h-12 rounded-2xl border-[#E5E7EB] bg-white focus-visible:ring-[#F97316]"
                  placeholder="Например, Камино де Сантьяго"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Описание</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  className="min-h-[110px] rounded-2xl border-[#E5E7EB] bg-white focus-visible:ring-[#F97316]"
                  placeholder="Короткое описание для участников"
                />
              </div>
            </FieldCard>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <Card className="sticky top-6 overflow-hidden rounded-[28px] border border-[#ECECEC] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
              <div className="px-6 py-5" style={{ backgroundColor: ACCENT_LIGHT }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                      <Trophy className="h-5 w-5" style={{ color: ACCENT }} />
                      Превью конфигурации
                    </CardTitle>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      variant="secondary"
                      className="rounded-2xl border border-[#FDBA74] bg-white text-[#C2410C] hover:bg-white/90"
                      onClick={handleExportPdf}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Экспорт PDF
                    </Button>
                    <Button
                      variant="secondary"
                      className="rounded-2xl border-0 text-white hover:opacity-90"
                      style={{ backgroundColor: ACCENT }}
                      onClick={handleCopy}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Копировать JSON
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="space-y-5 p-6">
                <div className="rounded-[28px] border p-5" style={{ borderColor: ACCENT_BORDER, backgroundColor: ACCENT_LIGHT }}>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge className="rounded-full border-0 px-3 py-1 text-[#C2410C]" style={{ backgroundColor: "#FFE7D4" }}>
                      {preview.challenge_type}
                    </Badge>
                    <Badge className="rounded-full border-0 px-3 py-1 text-[#C2410C]" style={{ backgroundColor: "#FFE7D4" }}>
                      {preview.metric}
                      {preview.metric_unit ? ` • ${preview.metric_unit}` : ""}
                    </Badge>
                    {preview.competitive_mode ? (
                      <Badge className="rounded-full border-0 px-3 py-1 text-[#C2410C]" style={{ backgroundColor: "#FFE7D4" }}>
                        {preview.competitive_mode}
                      </Badge>
                    ) : null}
                    {preview.goal_route?.size_label ? (
                      <Badge className="rounded-full border-0 px-3 py-1 text-[#C2410C]" style={{ backgroundColor: "#FFE7D4" }}>
                        {preview.goal_route.size_label}
                      </Badge>
                    ) : null}
                  </div>
                  <h2 className="text-xl font-semibold leading-tight text-slate-900 md:text-2xl">{preview.name}</h2>
                  <p className="mt-3 text-[13px] leading-6 text-slate-600 md:text-sm">{preview.description}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoTile icon={Building2} label="Компания" value={preview.company_name || "-"} />
                  <InfoTile icon={Users} label="Количество человек" value={formatNumber(preview.people_count)} />
                  <InfoTile icon={CalendarDays} label="Старт" value={preview.start_date} />
                  <InfoTile icon={CalendarDays} label="Окончание" value={preview.end_date} />
                </div>

                <div className="rounded-[24px] border border-[#ECECEC] bg-white p-4">
                  <div className="mb-3 text-sm font-semibold text-slate-900">Параметры челленджа</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="rounded-full border-0 bg-[#F5F5F5] px-3 py-1 text-slate-700">
                      Вид: {preview.challenge_type}
                    </Badge>
                    {preview.competitive_mode ? (
                      <Badge variant="secondary" className="rounded-full border-0 bg-[#F5F5F5] px-3 py-1 text-slate-700">
                        Формат: {preview.competitive_mode}
                      </Badge>
                    ) : null}
                    {preview.metric ? (
                      <Badge variant="secondary" className="rounded-full border-0 bg-[#F5F5F5] px-3 py-1 text-slate-700">
                        Активность: {preview.metric}
                        {preview.metric_unit ? ` (${preview.metric_unit})` : ""}
                      </Badge>
                    ) : null}
                    {preview.leaderboard_mode ? (
                      <Badge variant="secondary" className="rounded-full border-0 bg-[#F5F5F5] px-3 py-1 text-slate-700">
                        Лидерборд: {preview.leaderboard_mode}
                      </Badge>
                    ) : null}
                  </div>
                </div>

                {preview.team_setup ? (
                  <div className="rounded-[24px] border border-[#ECECEC] bg-white p-4">
                    <div className="mb-3 text-sm font-semibold text-slate-900">Команды</div>
                    {preview.team_setup.sheet_link ? (
                      <div className="space-y-3">
                        <InfoTile icon={Link2} label="Excel-таблица" value={preview.team_setup.sheet_link} />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <InfoTile icon={Users} label="Количество команд" value={formatNumber(preview.team_setup.team_count)} />
                        <div className="flex flex-wrap gap-2">
                          {preview.team_setup.team_names?.map((teamName) => (
                            <Badge key={teamName} className="rounded-full border-0 bg-[#F5F5F5] px-3 py-1 text-slate-700">
                              {teamName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}

                {preview.goal_route ? (
                  <div className="rounded-[24px] border border-[#ECECEC] bg-white p-4">
                    <div className="mb-3 text-sm font-semibold text-slate-900">Цель</div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <InfoTile icon={Map} label="Маршрут" value={preview.goal_route.name} />
                      <InfoTile
                        icon={Route}
                        label={preview.metric}
                        value={`${formatNumber(preview.goal_route.value)} ${preview.goal_route.unit}`}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="rounded-[24px] border border-[#ECECEC] bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Link2 className="h-4 w-4" style={{ color: ACCENT }} />
                    Ссылка на компанию
                  </div>
                  <div className="break-all text-sm" style={{ color: ACCENT }}>
                    {preview.company_link || "-"}
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#ECECEC] bg-[#FAFAFA] p-4">
                  <div className="mb-2 text-sm font-semibold text-slate-900">JSON-конфиг</div>
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words text-[11px] leading-5 text-slate-600 md:text-xs">
                    {JSON.stringify(previewJson, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
