import { StyleSheet, Platform } from 'react-native';

export const MAIN_COLOR = '#BF6A2A';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  introContainer: { flex: 1, backgroundColor: '#FFF' },
  introContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  logoPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF0E6', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  introTitle: { fontSize: 32, fontWeight: '800', color: '#1F2937', marginBottom: 12 },
  introSubtitle: { fontSize: 20, lineHeight: 32, fontWeight: '500', color: '#6B7280', textAlign: 'center' },
  introBottom: { paddingBottom: 60, paddingHorizontal: 30 },
  startButton: { flexDirection: 'row', backgroundColor: MAIN_COLOR, paddingVertical: 18, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  startButtonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  headerArea: { paddingTop: Platform.OS === 'android' ? 40 : 20, paddingHorizontal: 24, paddingBottom: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  homeButton: { padding: 4 },
  statusPill: { flexDirection: 'row', alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, alignItems: 'center' },
  statusText: { fontSize: 14, fontWeight: '600' },
  conversationSurface: { flex: 1, paddingHorizontal: 32, justifyContent: 'center' },
  textWrapper: { alignItems: 'center' },
  responseText: { fontSize: 26, lineHeight: 40, fontWeight: '600', color: '#1F2937', textAlign: 'center' },
  placeholderText: { color: '#9CA3AF', fontWeight: '400', fontSize: 22 },
  processingWrapper: { alignItems: 'center', justifyContent: 'center' },
  processingText: { marginTop: 20, fontSize: 16, color: '#6B7280', fontWeight: '500', textAlign: 'center' },
  bottomConsole: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 40, paddingBottom: Platform.OS === 'ios' ? 50 : 40, alignItems: 'center', elevation: 20 },
  micShadowWrapper: { marginBottom: 30 },
  micButton: { width: 88, height: 88, borderRadius: 44, backgroundColor: MAIN_COLOR, alignItems: 'center', justifyContent: 'center', elevation: 10 },
  micButtonRecording: { backgroundColor: '#EF4444' },
  micButtonSpeaking: { backgroundColor: '#1F2937' },
  exitButton: { backgroundColor: '#F3F4F6', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24 },
  exitButtonText: { color: '#4B5563', fontSize: 16, fontWeight: '600' },
});