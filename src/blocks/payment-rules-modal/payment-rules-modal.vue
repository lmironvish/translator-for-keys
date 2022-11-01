<template>
    <div class="payment-rules-modal">
        <slide-right @close="$emit('close')">
            <template #title>{{ title }}</template>

            <div class="payment-rules-modal__content">
                <div class="payment-rules-modal__text">
                    <template v-if="type === 'selfParticipation'">
                        Нажимая кнопку “Продолжить” Вы соглашаетесь с
                        <router-link :to="{name: 'dashboard.Information', hash: '#vozvrat'}">Правилами</router-link>
                        записи на платные семинары, в соответствии с которыми в случае последующей отмены записи,
                        инициированной Вами, возврат денежных средств производиться не будет.
                    </template>
                    <template v-else-if="type === 'cancelSelfParticipation'">
                        Вы отменяете запись на ранее оплаченный Вами семинар. В соответствии с
                        <router-link :to="{name: 'dashboard.Information', hash: '#vozvrat'}">Правилами</router-link>,
                        возврат денежных средств производится не будет.
                        <br><br>
                        После отмены записи на данный семинар Вы
                        можете повторно произвести запись на него в любое удобное для Вас время при наличии
                        свободных мест.
                    </template>
                    <template v-else-if="type === 'cancelBossParticipation'">
                        По причине того, что данный семинар был оплачен владельцем Вашего салона, перед отменой
                        убедитесь в том, что {{ createdBy ? createdBy.fio : 'Ваш руководитель' }} ознакомлен с
                        нижеуказанной информацией.
                        <br><br>
                        Вы отменяете запись на ранее оплаченный семинар. В соответствии с
                        <router-link :to="{name: 'dashboard.Information', hash: '#vozvrat'}">Правилами</router-link>,
                        возврат денежных средств производится не будет.
                        <br><br>
                        После отмены записи на данный семинар Вы можете повторно произвести запись на него в любое
                        удобное для Вас время при наличии свободных мест.
                    </template>
                </div>
            </div>

            <template #bottom>
                <div
                    v-if="type === 'cancelSelfParticipation' || type === 'cancelBossParticipation'"
                    class="payment-rules-modal__bottom-text"
                >
                    Вы уверены, что хотите отменить запись на семинар?
                </div>
                <div class="payment-rules-modal__buttons">
                    <button-block color="black" padding="50" @click="$emit('accept')">Продолжить</button-block>
                    <button-block color="linear-black" padding="50" @click="$emit('reject')">Отменить</button-block>
                </div>
            </template>
        </slide-right>
    </div>
</template>

<script>
    import SlideRight from '../slide-right';
    import ButtonBlock from '../button';

    export default {
        props: {
            type: {
                type: String,
                required: true,
                validator: (value) => {
                    return [
                        'selfParticipation', // мы сами участвуем в семинаре
                        'cancelSelfParticipation', // отмена участия в семинаре если мы сами записались
                        'cancelBossParticipation', // отмена участия в семинаре если нас записали
                    ].includes(value);
                },
            },
            createdBy: Object,
        },
        components: {
            SlideRight,
            ButtonBlock,
        },
        computed: {
            title() {
                const types = {
                    selfParticipation: 'Правила записи',
                    cancelSelfParticipation: 'Правила отмены записи',
                    cancelBossParticipation: 'Правила отмены записи',
                };

                return types[this.type];
            },
        }
    }
</script>

<style src="./payment-rules-modal.less" lang="less"/>
