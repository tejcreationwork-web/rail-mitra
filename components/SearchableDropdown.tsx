import { useState } from "react";
import { View, TextInput, ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

type Option = {
  id: string;
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  selectedValue: string | null;
  onSelect: (option: Option) => void;
  placeholder?: string;
};

export default function SearchableDropdown({ options, selectedValue, onSelect, placeholder }: Props) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label;

  // Filter by either search input or selected value
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Decide what to show in the input
  const inputValue = search.length > 0 ? search : (selectedLabel || "");

  return (
    <View style={styles.container}>
      {/* Input box */}
      <TextInput
        style={styles.input}
        placeholder={placeholder || "Search..."}
        value={inputValue}
        onChangeText={(text) => {
          setSearch(text);
          setShowDropdown(true);
          if (text === "") {
            // If cleared, reset selection
            onSelect({ id: "", label: "", value: "" });
          }
        }}
        onFocus={() => setShowDropdown(true)}
      />

      {/* Dropdown suggestions */}
      {showDropdown && filteredOptions.length > 0 && (
        <ScrollView style={styles.dropdown}>
          {filteredOptions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.option}
              onPress={() => {
                onSelect(item);
                setSearch(""); // clear search, but selection remains
                setShowDropdown(false);
              }}
            >
              <Text>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    backgroundColor: "#fff",
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
