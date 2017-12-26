import React, { Component } from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  Platform,
  StyleSheet,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import {
  getMetricMetaInfo,
  getDailyReminderValue,
  timeToString,
} from '../utils/helpers';
import { submitEntry, removeEntry } from '../utils/api';
import { white, purple } from '../utils/colors';
import { addEntry } from '../actions';
import UdaciSlider from './UdaciSlider';
import Steppers from './Steppers';
import DateHeader from './DateHeader';
import TextButton from './TextButton';

const SubmitButton = ({ onPress }) => {
  return (
    <TouchableHighlight
      style={
        Platform.OS === 'ios'
          ? styles.iosSubmitButton
          : styles.androidSubmitButton
      }
      onPress={onPress}
      underlayColor="#0f0"
    >
      <Text style={styles.submitButtonText}>SUBMIT</Text>
    </TouchableHighlight>
  );
};

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  };

  increment = metric => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState(state => {
      const count = state[metric] + step;

      return {
        [metric]: count > max ? max : count,
      };
    });
  };

  decrement = metric => {
    this.setState(state => {
      const count = state[metric] - getMetricMetaInfo(metric).step;

      return {
        [metric]: count < 0 ? 0 : count,
      };
    });
  };

  slide = (metric, value) => {
    this.setState(state => ({
      [metric]: value,
    }));
  };

  submit = () => {
    const key = timeToString();
    const entry = this.state;

    // Update Redux
    this.props.dispatch(
      addEntry({
        [key]: entry,
      })
    );

    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    }));

    // Navigate to home
    this.toHome();

    // Save to db
    submitEntry({ key, entry });

    // Clear local notification
  };

  reset = () => {
    const key = timeToString();

    // Update Redux
    this.props.dispatch(
      addEntry({
        [key]: getDailyReminderValue(),
      })
    );

    // Navigate to home
    this.toHome();

    // Update db
    removeEntry(key);
  };

  toHome = () => {
    this.props.navigation.dispatch(NavigationActions.back({
      key: 'AddEntry'
    }))
  }

  render() {
    const metaInfo = getMetricMetaInfo();

    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
            size={100}
          />
          <Text>You already logged your information for today</Text>
          <TextButton style={{ padding: 10 }} onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map(key => {
          const { getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];

          return (
            <View style={styles.row} key={key}>
              {getIcon()}
              {type === 'slider' ? (
                <UdaciSlider
                  value={value}
                  onChange={value => this.slide(key, value)}
                  {...rest}
                />
              ) : (
                <Steppers
                  value={value}
                  onIncrement={() => this.increment(key)}
                  onDecrement={() => this.decrement(key)}
                  {...rest}
                />
              )}
            </View>
          );
        })}
        <SubmitButton onPress={this.submit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iosSubmitButton: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitButton: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
    marginLeft: 30,
  },
});

const mapStateToProps = state => {
  const key = timeToString();

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined',
  };
};

export default connect(mapStateToProps)(AddEntry);
