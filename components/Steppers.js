import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';

const Steppers = ({ max, unit, step, value, onIncrement, onDecrement }) => {
  return (
    <View>
      <View>
        <TouchableHighlight onPress={onDecrement} underlayColor="#0f0">
          <FontAwesome name="minus" size={30} color={'black'} />
        </TouchableHighlight>
        <TouchableHighlight onPress={onIncrement} underlayColor="#0f0">
          <FontAwesome name="plus" size={30} color={'black'} />
        </TouchableHighlight>
      </View>
      <View>
        <Text>{value}</Text>
        <Text>{unit}</Text>
      </View>
    </View>
  );
};

export default Steppers;
