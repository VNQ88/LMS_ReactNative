import { commonStyles } from "@/styles/common/common.styles";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

export default function Button({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  const { width } = Dimensions.get("window");
  return (
    <TouchableOpacity
      style={[
        commonStyles.buttonContainer,
        {
          width: width * 1 - 100,
          height: 42,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 20,
          fontWeight: "500",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
