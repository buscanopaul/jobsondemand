import React from "react";
import { Image, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import useChunkArray from "../hooks/useChunkArray";
import trains from "../mock/train.json";

type Props = {};

const INITIAL_REGION = {
  latitude: 42.23981411231523,
  longitude: 140.4833696755387,
  latitudeDelta: 5,
  longitudeDelta: 5,
};

// Hard code for example purposes only
const GOOGLE_MAPS_APIKEY = "AIzaSyA4HFMFFbg-AZgr3GXaG577dy0t87SVmVQ";

const colors = ["hotpink", "blue", "green", "purple", "orange"];

const Page = (props: Props) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={MapView.PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        zoomTapEnabled
        zoomControlEnabled
      >
        {trains.map((train) =>
          train.lines.map((line, lineIndex) => (
            <React.Fragment key={line.id}>
              <Marker
                key={lineIndex}
                coordinate={{ latitude: line.lat, longitude: line.lng }}
                title={line.name.en}
                description={line.name.ja}
              >
                <Image
                  source={require("../assets/images/lines.png")}
                  style={styles.pin}
                  resizeMode="contain"
                />
              </Marker>
              {line.stations.length > 1 &&
                useChunkArray(line.stations, 23).map((chunk, chunkIndex) => (
                  <MapViewDirections
                    key={`direction-${line.id}-${chunkIndex}`}
                    origin={{
                      latitude: chunk[0].location.lat,
                      longitude: chunk[0].location.lng,
                    }}
                    destination={{
                      latitude: chunk[chunk.length - 1].location.lat,
                      longitude: chunk[chunk.length - 1].location.lng,
                    }}
                    waypoints={chunk.slice(1, -1).map((station) => ({
                      latitude: station.location.lat,
                      longitude: station.location.lng,
                    }))}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={4}
                    strokeColor={colors[lineIndex % colors.length]}
                  />
                ))}
            </React.Fragment>
          ))
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  pin: {
    width: 50,
    height: 50,
  },
});

export default Page;
