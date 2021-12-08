import Vuex from "vuex";
import Vue from "vue";
import storeSource from "./area-list.json";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        /*landing store*/
        currentMenuItemIndex: 0, //хранит переменную из плагина Pageable для навигации
        isOverlayModeOn: false,

        /*wizard store*/
        sourceZones: storeSource,
        currentStep: 0,  //текущий шаг в конструкторе. по умолчанию 0
        availableBuildindList: [true, true, true, true],  //список корпусов доступных для выбора в данный момент
        availableFloorlist: [],  //список этажей доступных для выбора в данный момент
        availableArealist: [],  //список помещений доступных для выбора в данный момент
        optionImage: null,
        selectedOptions: {},
        selectedZone: {
            building: null,
            floorIndex: null, //это не номер этажа! это номер в массиве availableFloorlist
            areaLimits: [0, 100000],
            thirdBuildingLimits: true,
            areaSquare: null,   //площадь выбранного помещенния, в пределах этажа ипользуется как id Т к других id нету  TODO: когда определимся со спорными зонами, пронумеровать все площади
            selectedRoomlayout: 5,
            selectedRoomLayoutImgPath: null,
            availableRoomLayout: null, //массив кодирующий возможные варианты кодировки
                            //расшифровка позициций
                            // 0 - 1 перегородка + кухня
                            // 1 - 1 перегородка
                            // 2 - 2 перегородки + кухня
                            // 3 - 2 перегородки
                            // 4 - без перегородки + кухня
                            // 5 - без перегородки (значение по умолчанию)
                            // 6 - кабинетная + кухня
                            // 7 - кабинетная
        },
    },
    getters: {
        currentStep: state=>state.currentStep,
        smallestArea: state => {
            return state.sourceZones.reduce((prev, curr) =>
                prev.area < curr.area ? prev : curr
            ).area;
        },
        biggestArea: state => 740,
        //TODO: пока захардкодили 740, если будут изменения перенести сюда алгоритм сортировки отсюда https://codepen.io/vodilova741109/pen/YzxZpNO
        currentFloor: state => {
            if (state.availableFloorlist.length > 0) {
                return state.availableFloorlist[state.selectedZone.floorIndex];
            } else {
                return 1;
            }
        },
        listOfAllPossibleAreas: state => {
            return state.sourceZones.map(item => item.area).sort().filter((elem, pos, arr) => arr.indexOf(elem) == pos);
        },
        checkIfAreaExistInCurrentFloor: (state, getters) => (square) => {
            return state.sourceZones.some(item => item.area === square && item.floor === getters.currentFloor);
        },
        getOptionImage: state => state.optionImage
    },
    mutations: {
        /*landing mutation*/
        updateCurrentMenuItemIndex(state, newIndex) {
            state.currentMenuItemIndex = newIndex;
        },
        switchOverlayMode(state) {
            state.isOverlayMode = !state.isOverlayMode
        },
        /*wizard mutation*/
        updateCurrentStep(state, newStep) {
            state.currentStep = newStep
        },
        setMinimumSuitableArea(state, newValue) {
            state.selectedZone.minimumSuitableArea = newValue;
        },
        setTheMostSuitableArea(state, newValue) {
            state.selectedZone.theMostSuitableArea = newValue;
        },
        updateSelectedBuilding(state, newValue) {
            /*в сторе хранить только в строковом виде что бы срабатывал watcher для radiobutton */
            let tempObj = {};
            state.selectedZone.building = newValue;
            state.availableFloorlist = [];
            state.availableArealist = [];

            state.sourceZones.forEach((item) => {
                if (item.building == newValue) {
                    if (!tempObj.hasOwnProperty(item.floor)) tempObj[item.floor] = [];
                    tempObj[item.floor].push(item.area);
                }
            })

            state.availableArealist = tempObj;
            Object.keys(tempObj).forEach(el => state.availableFloorlist.push(parseInt(el)));

            //если изменился выбор здания , то выбор этажа и помещения уже не актуален, скидываем его
            state.selectedZone.areaSquare = null;
            state.selectedZone.floorIndex = 0;
        },
        updatecurrentFloorIndex(state, newValue) {
            state.selectedZone.floorIndex = newValue;
            state.selectedZone.areaSquare = null;
        },
        updateSelectedArea(state, newValue) {
            state.selectedZone.areaSquare = newValue;
            //если изменилось текущеее помещение, обновим данные про доступные планировки
            //предполагаем что данные square уже провалидироваанны новое значение площади есть в sourceZones
            //достанем из sourceZones информацию о текущем помещении
            let currentFloor = state.availableFloorlist[state.selectedZone.floorIndex];
            let currentArea = newValue!=undefined ? state.sourceZones.find(item => item.area === newValue && item.floor === currentFloor):undefined; 
            if (currentArea) {
                state.selectedZone.availableRoomLayout = currentArea.possibleLayoutOptions;
            } 
        },
        updateSelectedRoomLayoutIndex(state, newValue) {
            state.selectedZone.selectedRoomlayout = newValue;
        },
        updateSelectedRoomLayoutImg(state, newValue) {
            state.selectedZone.selectedRoomLayoutImgPath = newValue;
        },
        updateAreaLimits(state, newValue) {
            //вызывается из слайдера на первом шаге
            state.selectedZone.areaLimits = newValue;

            //так же нужно обновить список доступных корпусов / availableBuildindList
            //обязательно надо пересоздать массив что бы сработали watcher-ы
            state.availableBuildindList = [false, false, false];
            state.sourceZones.forEach(item => {
                if (item.area >= newValue[0] && item.area <= newValue[1]) {
                    state.availableBuildindList[item.building] = true;
                }
            });

            //доступность последнего корпуса изменяем принудительно т к его доступность зависит от чекбокса
            state.availableBuildindList[3] = state.selectedZone.thirdBuildingLimits;
        },
        updateThirdBuildingLimits(state, newValue) {
            state.selectedZone.thirdBuildingLimits = newValue;
            state.availableBuildindList[3] = newValue
        },
        updateSelectedOptions(state, newValue) {
            state.selectedOptions = newValue;
        },
        updateOptionImage(state, newValue) {
            state.optionImage = newValue;
        }
    }
})