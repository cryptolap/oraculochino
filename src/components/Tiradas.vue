<template>
<v-layout row align-end style="height: 220px" mx-2>
    <v-layout column reverse>

        <v-flex v-for="(val,key) in v_tmp" :key="key">
            <v-layout row justify-space-between v-if="v_tmp[key]%2">
                <v-flex xs4 sm3 text-xs-left text-md-center>
                    <v-icon v-if="v_tmp[key]==9" color="light_yellow">far fa-life-ring</v-icon><v-icon v-else color="light_yellow">fab fa-gg-circle</v-icon>
                    <v-icon v-if="v_tmp[key]>=8" color="light_yellow">far fa-life-ring</v-icon><v-icon v-else color="light_yellow">fab fa-gg-circle</v-icon>
                    <v-icon v-if="v_tmp[key]>=7" color="light_yellow">far fa-life-ring</v-icon><v-icon v-else color="light_yellow">fab fa-gg-circle</v-icon>
                </v-flex>
                <v-flex xs8 sm9 align-self-center text-xs-right>                
                    <v-card light 
                        :class="{ 'deep-orange darken-4': v_tmp[key]==9 }"
                        elevation="6"    
                        height="20"
                        width="100%"
                    ><v-chip small><span class="caption font-weight-bold">{{ v_tmp[key] }}</span></v-chip>
                    </v-card>                   
                </v-flex>
                
            </v-layout>
            <v-layout row justify-space-between v-else>
                <v-flex xs4 sm3 text-xs-left text-md-center >
                    <v-icon v-if="v_tmp[key]==9" color="light_yellow">far fa-life-ring</v-icon><v-icon v-else color="light_yellow">fab fa-gg-circle</v-icon>
                    <v-icon v-if="v_tmp[key]>=8" color="light_yellow">far fa-life-ring</v-icon><v-icon v-else color="light_yellow">fab fa-gg-circle</v-icon>
                    <v-icon v-if="v_tmp[key]>=7" color="light_yellow">far fa-life-ring</v-icon><v-icon v-else color="light_yellow">fab fa-gg-circle</v-icon>       
                </v-flex>
                <v-flex xs3 sm4 align-self-center>
                    <v-card light 
                        elevation="6"
                        :class="{ 'deep-orange darken-4': v_tmp[key]==6 }"
                        height="20"
                        width="100%"
                    >
                    </v-card>
                </v-flex>
                <v-flex xs2 sm1>
                    
                </v-flex>
                <v-flex xs3 sm4 align-self-center text-xs-right> 
                    <v-card light 
                        elevation="6"
                        :class="{ 'deep-orange darken-4': v_tmp[key]==6 }"
                        height="20"
                        width="100%"
                    ><v-chip small><span class="caption font-weight-bold">{{ v_tmp[key] }}</span></v-chip>
                    </v-card> 
                </v-flex>                                    
            </v-layout>
        </v-flex>
    </v-layout>
</v-layout>
</template>

<script>
export default {
    name: "Tiradas",
    props: ["v_tmp"],
};
</script>
