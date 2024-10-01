import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from "@expo/vector-icons";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "21a4f0da416b395b495830f757ea6ae3" //원래 이러면 안되지만... 무료 api 키니까...
const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("로딩중...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const formatDate = (dt_txt) => {
    const date = new Date(dt_txt);
    const month = date.getMonth() + 1;  // 월은 0부터 시작하므로 1을 더함
    const day = date.getDate();
    return `${month}/${day}`;
  };
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 })
    const location = await Location.reverseGeocodeAsync({ latitude, longitude })
    setCity(location[0].city)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(
      json.list.filter((weather) => {
        if (weather.dt_txt.includes("03:00:00")) {
          return weather;
        }
      })
    );
  }
  useEffect(() => {
    getWeather();
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {days.length === 0 ?
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" />
          </View>
          :
          days.map((day, index) =>
            <View style={styles.day} key={index}>
              <Text style={styles.date}>{formatDate(day.dt_txt)}</Text>
              <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(0)}°</Text>
              <Fontisto name={icons[day.weather[0].main]} size={48} color="white" />
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          )}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightskyblue",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
    color: "white"
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: -20,
    fontSize: 168,
    color: "white"
  },
  description: {
    color: "white",
    fontSize: 60
  },
  tinyText: {
    fontSize: 20,
    color: "white"
  },
  date: {
    marginTop: 50,
    fontSize: 40,
    color: "white",
  }
});
