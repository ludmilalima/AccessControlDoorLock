//React imports
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';

//Firebase imports
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

//Navigation imports
import {StackActions} from '@react-navigation/native';

//Other
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/AntDesign';

const ReservationForms = ({route, navigation}) => {
    const {classroom, month, day} = route.params;

    const [firstClass, setFirstClass] = useState(false); //08:00 as 10:00
    const [secondClass, setSecondClass] = useState(false); //10:00 as 12:00
    const [thirdClass, setThirdClass] = useState(false); //12:00 as 13:30
    const [fourthClass, setFourthClass] = useState(false); //13:30 as 15:30
    const [fifthClass, setFifthClass] = useState(false); //15:30 as 17:30
    const [sixthClass, setSixthClass] = useState(false); //17:30 as 19:00
    const [seventhClass, setSeventhClass] = useState(false); //19:00 as 21:00
    const [eigthClass, setEigthClass] = useState(false); //21:00 as 23:00
    const [available, setAvailable] = useState([true, true, true, true, true, true, true, true]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        firebase.firestore().collection('SALAS').
            where('SALA', '==', classroom).get().then(async classSnap => {
                let classDoc
                if(classSnap.empty){
                    classDoc = await firebase.firestore().collection('SALAS').
                        add({SALA: classroom});
                }else{
                    classDoc = classSnap.docs[0].ref;
                }
                firebase.firestore().collection('SCHEDULE').
                    where('MES', '==', month).get().then(monthSnap => {
                        const monthDoc = monthSnap.docs[0];
                        firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                            collection('MONTH_SCHED').where('DIA', '==', day.toString()).get().
                                then(daySnap => {
                                    const dayDoc = daySnap.docs[0];
                                    firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                        collection('MONTH_SCHED').doc(dayDoc.id).collection('DAY_SCHED').
                                                where('SALA', '==', classDoc).get().
                                                    then(finalSnap => {
                                                        console.log(monthDoc.id);
                                                        console.log(dayDoc.id);
                                                        console.log(classDoc);
                                                        let currAvailable = available;
                                                        console.log(finalSnap);
                                                        finalSnap.forEach(doc => {
                                                            console.log(doc.data().HORA_INIT);
                                                            if(doc.data().HORA_INIT == '11:00'){
                                                                currAvailable[0] = false;
                                                            }else if(doc.data().HORA_INIT == '13:00'){
                                                                currAvailable[1] = false;
                                                            }else if(doc.data().HORA_INIT == '15:00'){
                                                                currAvailable[2] = false;
                                                            }else if(doc.data().HORA_INIT == '16:30'){
                                                                currAvailable[3] = false;
                                                            }else if(doc.data().HORA_INIT == '18:30'){
                                                                currAvailable[4] = false;
                                                                setAvailable(currAvailable);
                                                            }else if(doc.data().HORA_INIT == '20:30'){
                                                                currAvailable[5] = false;
                                                            }else if(doc.data().HORA_INIT == '22:00'){
                                                                currAvailable[6] = false;
                                                            }else if(doc.data().HORA_INIT == '00:00'){
                                                                currAvailable[7] = false;
                                                            }
                                                        })
                                                        setAvailable(currAvailable);
                                                        setLoading(false);
                                                    })
                                })
                    }).catch(err => {
                        console.log(err);
                    })
            }).catch(err => {
                console.log(err);
            });
    }, [])

    const submitReservations = async () => {
        const currUser = firebase.auth().currentUser;

        let classDoc = await firebase.firestore().collection('SALAS').
            where('SALA', '==', classroom).get();
        if(classDoc.empty){
            classDoc = await firebase.firestore().collection('SALAS').
                add({SALA: classroom});
        }else{
            classDoc = classDoc.docs[0].ref;
        }

        console.log(classDoc);
        
        await firebase.firestore().collection('USERS').doc(currUser.uid).get().then(async userSnapshot => {
            if(firstClass){
                firebase.firestore().collection('SCHEDULE').
                    where('MES', '==', month).get().then(monthSnap => {
                        monthSnap.forEach(monthDoc => {
                            firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                collection('MONTH_SCHED').where('DIA', '==', day.toString()).get().then(daySnap => {
                                    daySnap.forEach(dayDoc => {
                                        firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                            collection('MONTH_SCHED').doc(dayDoc.id).collection('DAY_SCHED').
                                                where('HORA_INIT', '==', '11:00').
                                                    where('SALA', '==', classDoc).get().
                                                        then(finalSnap => {
                                                            if(finalSnap.empty){
                                                                firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                                                    collection('MONTH_SCHED').doc(dayDoc.id).
                                                                        collection('DAY_SCHED').add({
                                                                            HORA_INIT: '11:00',
                                                                            HORA_FIM: '13:00',
                                                                            MES: month,
                                                                            DIA: day,
                                                                            USER: userSnapshot.ref,
                                                                            SALA: classDoc,
                                                                        })
                                                            }
                                                        })
                                                        
                                        })
                                    })
                                })
                    }).catch(err => {
                        console.log(err);
                    })
            }
            if(secondClass){
                firebase.firestore().collection('SCHEDULE').
                    where('MES', '==', month).get().then(monthSnap => {
                        monthSnap.forEach(monthDoc => {
                            firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                collection('MONTH_SCHED').where('DIA', '==', day.toString()).get().then(daySnap => {
                                    daySnap.forEach(dayDoc => {
                                        firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                            collection('MONTH_SCHED').doc(dayDoc.id).collection('DAY_SCHED').
                                                where('HORA_INIT', '==', '13:00').
                                                    where('SALA', '==', classDoc).get().
                                                        then(finalSnap => {
                                                            if(finalSnap.empty){
                                                                firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                                                    collection('MONTH_SCHED').doc(dayDoc.id).
                                                                        collection('DAY_SCHED').add({
                                                                            HORA_INIT: '13:00',
                                                                            HORA_FIM: '15:00',
                                                                            USER: userSnapshot.ref,
                                                                            SALA: classDoc,
                                                                            MES: month,
                                                                            DIA: day,
                                                                        })
                                                            }
                                                        })
                                    })
                                })
                        })
                    }).catch(err => {
                        console.log(err);
                    })
                
            }
            if(thirdClass){
                firebase.firestore().collection('SCHEDULE').
                    where('MES', '==', month).get().then(monthSnap => {
                        monthSnap.forEach(monthDoc => {
                            firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                collection('MONTH_SCHED').where('DIA', '==', day.toString()).get().then(daySnap => {
                                    daySnap.forEach(dayDoc => {
                                        firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                            collection('MONTH_SCHED').doc(dayDoc.id).collection('DAY_SCHED').
                                                where('HORA_INIT', '==', '15:00').
                                                    where('SALA', '==', classDoc).get().
                                                        then(finalSnap => {
                                                            if(finalSnap.empty){
                                                                firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                                                    collection('MONTH_SCHED').doc(dayDoc.id).
                                                                        collection('DAY_SCHED').add({
                                                                            HORA_INIT: '15:00',
                                                                            HORA_FIM: '16:30',
                                                                            USER: userSnapshot.ref,
                                                                            SALA: classDoc,
                                                                            MES: month,
                                                                            DIA: day,
                                                                        })
                                                            }
                                                        })
                                    })
                                })
                        })
                    }).catch(err => {
                        console.log(err);
                    })
            }
            if(fourthClass){
                firebase.firestore().collection('SCHEDULE').
                    where('MES', '==', month).get().then(monthSnap => {
                        monthSnap.forEach(monthDoc => {
                            firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                collection('MONTH_SCHED').where('DIA', '==', day.toString()).get().then(daySnap => {
                                    daySnap.forEach(dayDoc => {
                                        firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                            collection('MONTH_SCHED').doc(dayDoc.id).collection('DAY_SCHED').
                                                where('HORA_INIT', '==', '16:30').
                                                    where('SALA', '==', classDoc).get().
                                                        then(finalSnap => {
                                                    if(finalSnap.empty){
                                                        firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                                            collection('MONTH_SCHED').doc(dayDoc.id).
                                                                collection('DAY_SCHED').add({
                                                                    HORA_INIT: '16:30',
                                                                    HORA_FIM: '18:30',
                                                                    USER: userSnapshot.ref,
                                                                    SALA: classDoc,
                                                                    MES: month,
                                                                    DIA: day,
                                                                })
                                                    }
                                                })
                                    })
                                })
                        })
                    }).catch(err => {
                        console.log(err);
                    })
            }
            if(fifthClass){
                firebase.firestore().collection('SCHEDULE').
                    where('MES', '==', month).get().then(monthSnap => {
                        monthSnap.forEach(monthDoc => {
                            firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                collection('MONTH_SCHED').where('DIA', '==', day.toString()).get().then(daySnap => {
                                    daySnap.forEach(dayDoc => {
                                        console.log(dayDoc);
                                        firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                            collection('MONTH_SCHED').doc(dayDoc.id).collection('DAY_SCHED').
                                                where('HORA_INIT', '==', '18:30').
                                                where('SALA', '==', classDoc).get().
                                                then(finalSnap => {
                                                    console.log('FINAL');
                                                    if(finalSnap.empty){
                                                        firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                                            collection('MONTH_SCHED').doc(dayDoc.id).
                                                                collection('DAY_SCHED').add({
                                                                    HORA_INIT: '18:30',
                                                                    HORA_FIM: '20:30',
                                                                    USER: userSnapshot.ref,
                                                                    SALA: classDoc,
                                                                    MES: month,
                                                                    DIA: day,
                                                                })
                                                    }
                                                })
                                    })
                                })
                        })
                    }).catch(err => {
                        console.log(err);
                    })
                
            }
            if(sixthClass){
                firebase.firestore().collection('SCHEDULE').
                    where('MES', '==', month).get().then(monthSnap => {
                        monthSnap.forEach(monthDoc => {
                            firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                collection('MONTH_SCHED').where('DIA', '==', day.toString()).get().then(daySnap => {
                                    daySnap.forEach(dayDoc => {
                                        console.log(dayDoc);
                                        firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                            collection('MONTH_SCHED').doc(dayDoc.id).collection('DAY_SCHED').
                                                where('HORA_INIT', '==', '20:30').
                                                where('SALA', '==', classDoc).get().
                                                then(finalSnap => {
                                                    console.log('FINAL');
                                                    if(finalSnap.empty){
                                                        firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                                            collection('MONTH_SCHED').doc(dayDoc.id).
                                                                collection('DAY_SCHED').add({
                                                                    HORA_INIT: '20:30',
                                                                    HORA_FIM: '22:00',
                                                                    USER: userSnapshot.ref,
                                                                    SALA: classDoc,
                                                                    MES: month,
                                                                    DIA: day,
                                                                })
                                                    }
                                                })
                                    })
                                })
                        })
                    }).catch(err => {
                        console.log(err);
                    })
                
            }
            if(seventhClass){
                firebase.firestore().collection('SCHEDULE').
                    where('MES', '==', month).get().then(monthSnap => {
                        monthSnap.forEach(monthDoc => {
                            firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                collection('MONTH_SCHED').where('DIA', '==', day.toString()).get().then(daySnap => {
                                    daySnap.forEach(dayDoc => {
                                        console.log(dayDoc);
                                        firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                            collection('MONTH_SCHED').doc(dayDoc.id).collection('DAY_SCHED').
                                                where('HORA_INIT', '==', '22:00').
                                                where('SALA', '==', classDoc).get().
                                                then(finalSnap => {
                                                    if(finalSnap.empty){
                                                        firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                                            collection('MONTH_SCHED').doc(dayDoc.id).
                                                                collection('DAY_SCHED').add({
                                                                    HORA_INIT: '22:00',
                                                                    HORA_FIM: '23:59',
                                                                    USER: userSnapshot.ref,
                                                                    SALA: classDoc,
                                                                    MES: month,
                                                                    DIA: day,
                                                                })
                                                    }else{

                                                    }
                                                })
                                    })
                                })
                        })
                    }).catch(err => {
                        console.log(err);
                    })
                
            }
            if(eigthClass){
                firebase.firestore().collection('SCHEDULE').
                    where('MES', '==', month).get().then(monthSnap => {
                        monthSnap.forEach(monthDoc => {
                            firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                collection('MONTH_SCHED').where('DIA', '==', (day+1).toString()).get().then(daySnap => {
                                    daySnap.forEach(dayDoc => {
                                        console.log(dayDoc);
                                        firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                            collection('MONTH_SCHED').doc(dayDoc.id).collection('DAY_SCHED').
                                                where('HORA_INIT', '==', '00:01').
                                                where('SALA', '==', classDoc).get().
                                                then(finalSnap => {
                                                    if(finalSnap.empty){
                                                        firebase.firestore().collection('SCHEDULE').doc(monthDoc.id).
                                                            collection('MONTH_SCHED').doc(dayDoc.id).
                                                                collection('DAY_SCHED').add({
                                                                    HORA_INIT: '00:01',
                                                                    HORA_FIM: '02:00',
                                                                    USER: userSnapshot.ref,
                                                                    SALA: classDoc,
                                                                    MES: month,
                                                                    DIA: day+1,
                                                                })
                                                    }
                                                })
                                    })
                                })
                        })
                    }).catch(err => {
                        console.log(err);
                    })
            }
        }).catch(err => {
            console.log(err);
        });
        
        const popAction = StackActions.pop(3);
        navigation.dispatch(popAction);
    }

    if(loading){
        return(
            <View>
                <Text></Text>
                <Text style={styles.texto}>
                    Checando hor??rios dispon??veis...
                </Text>
            </View>
        )
    }else{
        return (
            <View style={styles.mainView}>
                     
                {
                    available[0] == true ? (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.texto}> 
                                08:00 ??s 10:00 
                            </Text>
                            <CheckBox 
                                value={firstClass}
                                onValueChange={(newValue) => setFirstClass(newValue)}
                                style = {styles.checkbox}
                            />
                        </View>
                    ) : (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.textoriscado}>
                                08:00 ??s 10:00 
                            </Text>
                            <CheckBox
                                value={eigthClass}
                                onValueChange={(newValue) => setEigthClass(newValue)}
                                style = {styles.checkbox}
                                disabled = "true"
                            />
                        </View>
                    )
                }
                
                {
                    available[1] == true ? (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.texto}>
                                10:00 ??s 12:00
                            </Text>
                            <CheckBox
                                value={secondClass}
                                onValueChange={(newValue) => setSecondClass(newValue)}
                                style = {styles.checkbox}
                            />
                        </View >
                    ) : (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.textoriscado}>
                                10:00 ??s 12:00
                            </Text>
                            <CheckBox
                                value={eigthClass}
                                onValueChange={(newValue) => setEigthClass(newValue)}
                                style = {styles.checkbox}
                                disabled = "true"
                            />
                        </View>
                    )
                }

                {
                    available[2] == true ? (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.texto}>
                                12:00 ??s 13:30
                            </Text>
                            <CheckBox
                                value={thirdClass}
                                onValueChange={(newValue) => setThirdClass(newValue)}
                                style = {styles.checkbox}
                            />
                        </View>
                    ) : (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.textoriscado}>
                                12:00 ??s 13:30
                            </Text>
                            <CheckBox
                                value={eigthClass}
                                onValueChange={(newValue) => setEigthClass(newValue)}
                                style = {styles.checkbox}
                                disabled = "true"
                            />
                        </View>
                    )
                }

                {
                    available[3] == true ? (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.texto}>
                                13:30 ??s 15:30
                            </Text>
                            <CheckBox
                                value={fourthClass}
                                onValueChange={(newValue) => setFourthClass(newValue)}
                                style = {styles.checkbox}
                            />
                        </View>
                    ) : (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.textoriscado}>
                                13:30 ??s 15:30
                            </Text>
                            <CheckBox
                                value={eigthClass}
                                onValueChange={(newValue) => setEigthClass(newValue)}
                                style = {styles.checkbox}
                                disabled = "true"
                            />
                        </View>
                    )    
                }

                {
                    available[4] == true ? (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.texto}>
                                15:30 ??s 17:30
                            </Text>
                            <CheckBox
                                value={fifthClass}
                                onValueChange={(newValue) => setFifthClass(newValue)}
                                style = {styles.checkbox}
                            />
                        </View>
                    ) : (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.textoriscado}>
                                15:30 ??s 17:30
                            </Text>
                            <CheckBox
                                value={eigthClass}
                                onValueChange={(newValue) => setEigthClass(newValue)}
                                style = {styles.checkbox}
                                disabled = "true"
                            />
                        </View>
                    ) 
                }

                {
                    available[5] == true ? (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.texto}>
                                17:30 ??s 19:00
                            </Text>
                            <CheckBox
                                value={sixthClass}
                                onValueChange={(newValue) => setSixthClass(newValue)}
                                style = {styles.checkbox}
                            />
                        </View>
                    ) : (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.textoriscado}>
                                17:30 ??s 19:00
                            </Text>
                            <CheckBox
                                value={eigthClass}
                                onValueChange={(newValue) => setEigthClass(newValue)}
                                style = {styles.checkbox}
                                disabled = "true"
                            />
                        </View>
                    )
                }
                
                {
                    available[6] == true ? (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.texto}>
                                19:00 ??s 21:00
                            </Text>
                            <CheckBox
                                value={seventhClass}
                                onValueChange={(newValue) => setSeventhClass(newValue)}
                                style = {styles.checkbox}
                            />
                        </View>
                    ) : (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.textoriscado}>
                                19:00 ??s 21:00
                            </Text>
                            <CheckBox
                                value={eigthClass}
                                onValueChange={(newValue) => setEigthClass(newValue)}
                                style = {styles.checkbox}
                                disabled = "true"
                            />
                        </View>
                    )
                }

                {
                    available[7] == true ? (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.texto}>
                                21:00 ??s 23:00
                            </Text>
                            <CheckBox
                                value={eigthClass}
                                onValueChange={(newValue) => setEigthClass(newValue)}
                                style = {styles.checkbox}
                            />
                        </View>
                    ) : (
                        <View style={styles.checkboxContainer}>
                            <Text style = {styles.textoriscado}>
                                21:00 ??s 23:00
                            </Text>
                            <CheckBox
                                value={eigthClass}
                                onValueChange={(newValue) => setEigthClass(newValue)}
                                style = {styles.checkbox}
                                disabled = "true"
                            />
                        </View>
                    )
                    
                }
                <View style={styles.BtnContainer}>
                    <TouchableOpacity style = {styles.bnt} onPress={submitReservations}>
                        <Icon name = "pluscircleo" size = {25} color = "white" >
                            <Text>  </Text>
                            <Text style = {styles.btnText}>
                                Reservar 
                            </Text>
                        </Icon>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex:1,
        alignItems: "stretch",
        justifyContent: "center",
        
    },
    bnt: {
        borderRadius: 8,
        alignSelf: "center",
        alignItems: "center",
    },
    btnText: {
        color: 'white',
        fontSize: 25,
    },
    texto: {
        fontSize: 20,
        alignSelf: "center",
        color: "#0073e6",
    },
    textoriscado: {
        fontSize: 20,
        alignSelf: "center",
        color: "red",
        textDecorationLine: "line-through"
    },
    checkboxContainer: {
        backgroundColor: '#cce6ff',
        flexDirection: "row",
        flex: 1,
        marginHorizontal: 4,
        marginVertical: 4,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },

        BtnContainer: {
        backgroundColor: '#0073e6',
        flexDirection: "row",
        flex: 1,
        marginHorizontal: 4,
        marginVertical: 4,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    checkbox : {
        alignSelf: "center",
    }
});

export default ReservationForms;