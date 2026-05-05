import { useWindowDimensions } from "react-native";

const useDeviceWidth = () => {
    const width = useWindowDimensions().width;
    if (width < 640) {
        return "sm";
    } else if (width < 768) {
        return "md";
    } else if (width < 1024) {
        return "lg";
    } else {
        return "xl";
    }
}

export default useDeviceWidth;   