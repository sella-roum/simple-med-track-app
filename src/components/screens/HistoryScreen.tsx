
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Search, Edit, Trash2, Clock, Pill, Loader2 } from 'lucide-react';
import { MedicationRecord } from '@/types/db';
import { 
  getAllMedicationRecords, 
  getMedicationRecordsByDateRange, 
  updateMedicationRecord, 
  deleteMedicationRecord 
} from '@/lib/db';

export const HistoryScreen = () => {
  const { toast } = useToast();
  
  // 今日の日付をYYYY-MM-DD形式で取得
  const today = new Date().toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [editingRecord, setEditingRecord] = useState<MedicationRecord | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [historyData, setHistoryData] = useState<MedicationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    try {
      setIsLoading(true);
      const records = await getAllMedicationRecords();
      setHistoryData(records);
    } catch (error) {
      console.error('履歴データの読み込みに失敗しました:', error);
      toast({
        title: "エラー",
        description: "履歴データの読み込みに失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (record: MedicationRecord) => {
    setEditingRecord(record);
    setEditFormData({
      time: record.time,
      medications: record.medications.map(med => ({
        ...med,
        actualDosage: med.actualDosage || med.dosage
      })),
      recordMemo: record.recordMemo || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;

    try {
      const updatedRecord: MedicationRecord = {
        ...editingRecord,
        time: editFormData.time,
        medications: editFormData.medications,
        recordMemo: editFormData.recordMemo
      };

      await updateMedicationRecord(updatedRecord);
      
      setHistoryData(prev => 
        prev.map(record => 
          record.id === editingRecord.id ? updatedRecord : record
        )
      );

      toast({
        title: "更新完了",
        description: "記録を更新しました。",
      });
      setEditingRecord(null);
      setEditFormData({});
    } catch (error) {
      console.error('記録の更新に失敗しました:', error);
      toast({
        title: "エラー",
        description: "記録の更新に失敗しました。",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (recordId: string) => {
    try {
      await deleteMedicationRecord(recordId);
      setHistoryData(prev => prev.filter(record => record.id !== recordId));
      
      toast({
        title: "削除完了",
        description: "記録を削除しました。",
      });
    } catch (error) {
      console.error('記録の削除に失敗しました:', error);
      toast({
        title: "エラー",
        description: "記録の削除に失敗しました。",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const records = await getMedicationRecordsByDateRange(startDate, endDate);
      setHistoryData(records);
      
      toast({
        title: "検索実行",
        description: `${startDate} から ${endDate} の記録を検索しました。`,
      });
    } catch (error) {
      console.error('検索に失敗しました:', error);
      toast({
        title: "エラー",
        description: "検索に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateMedicationDosage = (medIndex: number, newDosage: string) => {
    setEditFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, index) => 
        index === medIndex ? { ...med, actualDosage: newDosage } : med
      )
    }));
  };

  const groupedData = historyData.reduce((acc: { [key: string]: MedicationRecord[] }, record) => {
    if (!acc[record.date]) {
      acc[record.date] = [];
    }
    acc[record.date].push(record);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">服薬履歴</h2>
          <p className="text-sm sm:text-base text-gray-600">過去の服薬記録を確認できます</p>
        </div>
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">服薬履歴</h2>
        <p className="text-sm sm:text-base text-gray-600">過去の服薬記録を確認できます</p>
      </div>

      {/* 検索フィルター */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            期間検索
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-2 block">
                開始日
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-2 block">
                終了日
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
          </div>
          <Button 
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            <Search className="w-4 h-4 mr-2" />
            検索
          </Button>
        </CardContent>
      </Card>

      {/* 履歴一覧 */}
      <div className="space-y-4">
        {Object.keys(groupedData).length > 0 ? (
          Object.entries(groupedData)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, records]) => (
            <Card key={date} className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  {new Date(date).toLocaleDateString('ja-JP', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric', 
                    weekday: 'short' 
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {records
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((record) => (
                    <div key={record.id} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-blue-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm sm:text-base">{record.time}</span>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEdit(record)}
                                className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm px-2 sm:px-3"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                編集
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95vw] max-w-md max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-base sm:text-lg">記録編集</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-700 mb-2 block">服用時刻</Label>
                                  <Input 
                                    type="time" 
                                    value={editFormData.time || record.time}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, time: e.target.value }))}
                                    className="text-sm" 
                                  />
                                </div>

                                {/* 薬剤リスト */}
                                <div className="space-y-3">
                                  <Label className="text-sm font-medium text-gray-700">服用薬剤</Label>
                                  {editFormData.medications?.map((med, index) => (
                                    <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-blue-700 font-medium">
                                          <Pill className="w-4 h-4" />
                                          <span className="text-sm">{med.name}</span>
                                        </div>
                                        
                                        <div>
                                          <Label className="text-xs text-gray-600 block mb-1">
                                            処方量: {med.dosage}
                                          </Label>
                                          <Label className="text-xs font-medium text-gray-700 block mb-1">
                                            実際の服用量
                                          </Label>
                                          <Input
                                            value={med.actualDosage}
                                            onChange={(e) => updateMedicationDosage(index, e.target.value)}
                                            placeholder="例: 1錠"
                                            className="text-sm h-8"
                                          />
                                        </div>

                                        {med.memo && (
                                          <div className="text-xs text-blue-600 bg-white p-2 rounded border">
                                            <span className="font-medium">メモ: </span>
                                            {med.memo}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div>
                                  <Label className="text-sm font-medium text-gray-700 mb-2 block">記録メモ</Label>
                                  <Textarea
                                    value={editFormData.recordMemo || ''}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, recordMemo: e.target.value }))}
                                    placeholder="体調や服用時の状況など..."
                                    className="text-sm"
                                    rows={3}
                                  />
                                </div>

                                <Button 
                                  onClick={handleSaveEdit}
                                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm"
                                >
                                  保存
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-red-200 text-red-600 hover:bg-red-50 text-xs sm:text-sm px-2 sm:px-3"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                削除
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="w-[95vw] max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-base">記録を削除しますか？</AlertDialogTitle>
                                <AlertDialogDescription className="text-sm">
                                  この操作は取り消せません。本当に削除しますか？
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="text-sm">キャンセル</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(record.id)}
                                  className="bg-red-600 hover:bg-red-700 text-sm"
                                >
                                  削除
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {record.medications.map((med, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm sm:text-base">
                            <Pill className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="font-medium">{med.name}</span>
                            <span className="text-gray-600">({med.actualDosage || med.dosage})</span>
                            {med.memo && (
                              <span className="text-blue-600 text-xs sm:text-sm">- {med.memo}</span>
                            )}
                          </div>
                        ))}
                        {record.recordMemo && (
                          <div className="text-xs sm:text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                            💡 {record.recordMemo}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
            <CardContent className="p-6 sm:p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">記録が見つかりません</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">服薬記録を追加するか、検索条件を変更してください</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
